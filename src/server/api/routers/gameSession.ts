// src/server/api/routers/gameSession.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PlayerType } from "@prisma/client";

export const gameSessionRouter = createTRPCRouter({
  // Create a new game session
  create: protectedProcedure
    .input(
      z.object({
        deckIds: z.array(z.number()).min(1), // Human players' deck IDs
        computerDeckIds: z.array(z.number()).optional(), // AI players' deck IDs
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { deckIds, computerDeckIds = [] } = input;

      // Fetch human players' decks
      const playerDecks = await ctx.db.userCustomDeck.findMany({
        where: {
          id: { in: deckIds },
          userId: user.id,
        },
        include: {
          gameCards: true,
        },
      });

      if (playerDecks.length !== deckIds.length) {
        throw new Error("One or more decks not found.");
      }

      // Fetch AI decks
      const aiDecks = await ctx.db.userCustomDeck.findMany({
        where: { id: { in: computerDeckIds } },
        include: { gameCards: true },
      });

      if (aiDecks.length !== computerDeckIds.length) {
        throw new Error("One or more AI decks not found.");
      }

      // Initialize game state
      const initialGameState = {
        hands: {},
        battlers: {},
        turn: "", // Will set after players are added
        battleHistory: [],
        players: [], // Managed via GameSessionPlayer
      };

      // Create the game session
      const gameSession = await ctx.db.gameSession.create({
        data: {
          gameState: initialGameState,
          players: {
            create: [
              ...playerDecks.map((deck) => ({
                userId: user.id,
                playerType: PlayerType.HUMAN,
                deckId: deck.id,
              })),
              ...aiDecks.map((deck) => ({
                playerType: PlayerType.COMPUTER,
                deckId: deck.id,
              })),
            ],
          },
        },
        include: {
          players: true,
        },
      });

      // Optionally, initialize hands and battlers here or via separate procedures

      return gameSession;
    }),

  // Fetch a specific game session by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { user } = ctx.session;

      const gameSession = await ctx.db.gameSession.findUnique({
        where: { id },
        include: {
          players: {
            include: {
              user: true,
              deck: {
                include: {
                  gameCards: {
                    include: {
                      gameCard: {
                        include: { image: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!gameSession) {
        throw new Error("Game session not found.");
      }

      // Verify user participation
      const isParticipant = gameSession.players.some(
        (player) =>
          player.userId === user.id ||
          player.playerType === PlayerType.COMPUTER,
      );

      if (!isParticipant) {
        throw new Error("You are not part of this game session.");
      }

      return gameSession;
    }),

  // Perform a battle action
  performBattle: protectedProcedure
    .input(
      z.object({
        gameSessionId: z.string(),
        playerId: z.string(),
        playerCardId: z.number(),
        opponentCardId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { gameSessionId, playerId, playerCardId, opponentCardId } = input;
      const { user } = ctx.session;

      // Fetch game session
      const gameSession = await ctx.db.gameSession.findUnique({
        where: { id: gameSessionId },
        include: {
          players: true,
        },
      });

      if (!gameSession) {
        throw new Error("Game session not found.");
      }

      // Ensure player is part of the game session
      const player = gameSession.players.find(
        (p) =>
          p.id === playerId &&
          (p.userId === user.id || p.playerType === PlayerType.COMPUTER),
      );

      if (!player) {
        throw new Error("Player not part of the game session.");
      }

      // Fetch player and opponent cards
      const playerCard = await ctx.db.gameCard.findUnique({
        where: { id: playerCardId },
      });
      const opponentCard = await ctx.db.gameCard.findUnique({
        where: { id: opponentCardId },
      });

      if (!playerCard || !opponentCard) {
        throw new Error("One or both cards not found.");
      }

      // Perform battle logic
      let result: "PLAYER_WIN" | "OPPONENT_WIN" | "TIE" = "TIE";

      if (playerCard.powerLevel! > opponentCard.powerLevel!) {
        result = "PLAYER_WIN";
      } else if (playerCard.powerLevel! < opponentCard.powerLevel!) {
        result = "OPPONENT_WIN";
      }

      // Update game state based on result
      const gameState = gameSession.gameState as any; // Define proper TypeScript type

      // Example logic: Remove defeated battlers
      if (result === "PLAYER_WIN") {
        // Remove opponent's battler
        gameState.battlers[playerId] = gameState.battlers[playerId].filter(
          (card: any) => card.id !== playerCard.id,
        );
        gameState.battlers[opponentId] = gameState.battlers[opponentId].filter(
          (card: any) => card.id !== opponentCard.id,
        );
      } else if (result === "OPPONENT_WIN") {
        // Remove player's battler
        gameState.battlers[playerId] = gameState.battlers[playerId].filter(
          (card: any) => card.id !== playerCard.id,
        );
        gameState.battlers[opponentId] = gameState.battlers[opponentId].filter(
          (card: any) => card.id !== opponentCard.id,
        );
      } else {
        // Tie: Remove both battlers
        gameState.battlers[playerId] = gameState.battlers[playerId].filter(
          (card: any) => card.id !== playerCard.id,
        );
        gameState.battlers[opponentId] = gameState.battlers[opponentId].filter(
          (card: any) => card.id !== opponentCard.id,
        );
      }

      // Add to battle history
      gameState.battleHistory.push({
        playerCard,
        opponentCard,
        result,
      });

      // Determine next turn (simple cycling logic)
      const currentPlayerIndex = gameSession.players.findIndex(
        (p) => p.id === playerId,
      );
      const nextPlayerIndex =
        (currentPlayerIndex + 1) % gameSession.players.length;
      const nextPlayer = gameSession.players[nextPlayerIndex];
      gameState.turn = nextPlayer.id;

      // Update the game session with the new game state
      const updatedGameSession = await ctx.db.gameSession.update({
        where: { id: gameSessionId },
        data: { gameState },
      });

      // Check for game over conditions
      const activePlayers = gameSession.players.filter(
        (p) => gameState.battlers[p.id]?.length > 0,
      );

      if (activePlayers.length <= 1) {
        const winner = activePlayers[0];
        if (winner.playerType === PlayerType.HUMAN) {
          return {
            message: "You won the game!",
            gameState: updatedGameSession.gameState,
          };
        } else {
          return {
            message: "Computer won the game!",
            gameState: updatedGameSession.gameState,
          };
        }
      }

      return {
        message: "Battle resolved",
        gameState: updatedGameSession.gameState,
      };
    }),

  // Add more procedures like drawing a card, adding/removing players, etc., as needed
});
