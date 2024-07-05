import Phaser from "phaser";
import { type PlayerCharacter } from "./types";
import { AVATAR_MAX_HEIGHT, getSprite, scaleSprite } from "./utils/main";

export const TileKinds = [
  "GRASS",
  "TREE",
  "ROCK",
  "WATER",
  "SAND",
  "FLOOR",
  "WALL",
  "DOOR",
  "LAVA",
] as const;

type TileKind = (typeof TileKinds)[number];

export interface Tile {
  x: number;
  y: number;
  kind: TileKind;
}

class LevelMap {
  private tiles: (Tile | null)[][];
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = Array(height)
      .fill(null)
      .map(() => Array(width).fill(null));
  }

  generate(seed: number, isInterior: boolean): void {
    const rng = new Phaser.Math.RandomDataGenerator([seed.toString()]);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const kind = isInterior
          ? this.generateInteriorTile(x, y, rng)
          : this.generateExteriorTile(x, y, rng);
        const row = this.tiles[y];
        if (row) {
          row[x] = { x, y, kind };
        }
      }
    }
  }

  private generateInteriorTile(
    x: number,
    y: number,
    rng: Phaser.Math.RandomDataGenerator,
  ): TileKind {
    if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
      return "WALL";
    }
    const rand = rng.between(0, 100);
    if (rand < 80) return "FLOOR";
    if (rand < 95) return "ROCK";
    return "LAVA";
  }

  private generateExteriorTile(
    x: number,
    y: number,
    rng: Phaser.Math.RandomDataGenerator,
  ): TileKind {
    const rand = rng.between(0, 100);
    if (rand < 60) return "GRASS";
    if (rand < 75) return "TREE";
    if (rand < 85) return "ROCK";
    if (rand < 95) return "WATER";
    return "SAND";
  }

  getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    const row = this.tiles[y];
    return row?.[x] ?? null;
  }

  isTraversable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    return !["WALL", "TREE", "ROCK", "WATER"].includes(tile.kind);
  }

  isDangerous(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    return ["LAVA", "WATER"].includes(tile.kind);
  }

  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

class MapScene extends Phaser.Scene {
  private map!: LevelMap;
  private player!: PlayerCharacter;
  private playerSprite!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private tileSize: number = 32;

  constructor() {
    super("LevelMap");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
  }

  preload() {
    const sprite = getSprite(this.player.battler);
    this.load.spritesheet("player", sprite.spriteFile, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const mapWidth = 20;
    const mapHeight = 15;
    const seed = this.generateSeed(this.player.name);
    const isInterior = Math.random() < 0.5; // 50% chance of interior map

    this.map = new LevelMap(mapWidth, mapHeight);
    this.map.generate(seed, isInterior);

    this.renderMap();
    this.createPlayer();
    this.setupCamera();
    this.setupControls();
  }

  private generateSeed(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private renderMap() {
    const { width, height } = this.map.getDimensions();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = this.map.getTile(x, y);
        if (tile) {
          const color = this.getTileColor(tile.kind);
          const rect = this.add.rectangle(
            x * this.tileSize,
            y * this.tileSize,
            this.tileSize,
            this.tileSize,
            color,
          );
          rect.setOrigin(0);
        }
      }
    }
  }

  private getTileColor(kind: TileKind): number {
    switch (kind) {
      case "GRASS":
        return 0x00ff00;
      case "TREE":
        return 0x008000;
      case "ROCK":
        return 0x808080;
      case "WATER":
        return 0x0000ff;
      case "SAND":
        return 0xffff00;
      case "FLOOR":
        return 0xc0c0c0;
      case "WALL":
        return 0x800000;
      case "DOOR":
        return 0x8b4513;
      case "LAVA":
        return 0xff4500;
      default:
        return 0xffffff;
    }
  }

  private createPlayer() {
    const sprite = getSprite(this.player.battler);
    this.playerSprite = this.physics.add.sprite(
      this.tileSize,
      this.tileSize,
      "player",
      sprite.spriteStartVertical * 3 + sprite.spriteStartHorizontal,
    );
    scaleSprite(this.playerSprite, AVATAR_MAX_HEIGHT);
    this.playerSprite.setCollideWorldBounds(true);
  }

  private setupCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.map.width * this.tileSize,
      this.map.height * this.tileSize,
    );
    this.cameras.main.startFollow(this.playerSprite, true, 0.5, 0.5);
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys("W,A,S,D") as {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    } else {
      throw new Error("Keyboard input is not available");
    }
  }

  update() {
    const speed = 160;
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
    }

    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
    }

    this.playerSprite.setVelocity(velocityX, velocityY);

    // Check for dangerous tiles
    const playerTileX = Math.floor(this.playerSprite.x / this.tileSize);
    const playerTileY = Math.floor(this.playerSprite.y / this.tileSize);
    if (this.map.isDangerous(playerTileX, playerTileY)) {
      this.startBattle();
    }
  }

  private startBattle() {
    // Stop the player's movement
    this.playerSprite.setVelocity(0, 0);

    // Transition to the Battle scene
    this.scene.start("Battle", { player: this.player });
  }
}

export { LevelMap, MapScene };
