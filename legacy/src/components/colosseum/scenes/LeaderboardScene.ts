import Phaser from "phaser";

interface LeaderboardEntry {
  name: string;
  score: number;
  victories: number;
  level: number;
}

export class LeaderboardScene extends Phaser.Scene {
  private leaderboard: LeaderboardEntry[] = [];

  constructor() {
    super("Leaderboard");
  }

  create() {
    this.add
      .text(170, 30, "Leaderboard", { fontSize: "28px", color: "#fff" })
      .setOrigin(0.5);

    this.leaderboard.forEach((entry, index) => {
      this.add.text(
        20,
        70 + index * 40,
        `${index + 1}. ${entry.name}\nScore: ${entry.score}, Victories: ${
          entry.victories
        }, Level: ${entry.level}`,
        {
          fontSize: "14px",
          color: "#fff",
          align: "left",
          wordWrap: { width: 300 },
        },
      );
    });

    this.add
      .text(170, 490, "Restart Game", { fontSize: "20px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CharacterCreation"));
  }

  init(data: {
    name: string;
    score: number;
    victories: number;
    level: number;
  }) {
    // In a real application, you'd load the leaderboard from a server or local storage
    // Here, we'll just add the current score to a mock leaderboard
    this.leaderboard.push({
      name: data.name,
      score: data.score,
      victories: data.victories,
      level: data.level,
    });
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10); // Keep only top 10
  }
}
