import Phaser from "phaser";

interface LeaderboardEntry {
  name: string;
  score: number;
  victories: number;
}

export class LeaderboardScene extends Phaser.Scene {
  private leaderboard: LeaderboardEntry[] = [];

  constructor() {
    super("Leaderboard");
  }

  init(data: { score: number; victories: number }) {
    // In a real application, you'd load the leaderboard from a server or local storage
    // Here, we'll just add the current score to a mock leaderboard
    this.leaderboard.push({
      name: "Player",
      score: data.score,
      victories: data.victories,
    });
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
  }

  create() {
    this.add
      .text(400, 50, "Leaderboard", { fontSize: "36px", color: "#fff" })
      .setOrigin(0.5);

    this.leaderboard.forEach((entry, index) => {
      this.add.text(
        100,
        100 + index * 40,
        `${index + 1}. ${entry.name} - Score: ${entry.score}, Victories: ${
          entry.victories
        }`,
        { fontSize: "18px", color: "#fff" },
      );
    });

    this.add
      .text(400, 550, "Restart Game", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CharacterCreation"));
  }
}
