import Phaser from "phaser";
import { type MapData, type PlayerCharacter } from "./types";
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
  private mapSeed!: number;
  private isInterior!: boolean;
  private canEncounter: boolean = false;
  private animsCreated: boolean = false;
  private returnPosition?: { x: number; y: number };

  constructor() {
    super("LevelMap");
  }

  init(data: { player: PlayerCharacter; mapData?: MapData }) {
    this.player = data.player;
    if (data.mapData) {
      this.mapSeed = data.mapData.seed;
      this.returnPosition = data.mapData.playerPosition;
    } else {
      this.mapSeed = this.generateSeed(this.player.name);
    }
    this.isInterior = this.determineIsInterior(this.mapSeed);
    this.canEncounter = false;
  }

  private determineIsInterior(seed: number): boolean {
    const rng = new Phaser.Math.RandomDataGenerator([seed.toString()]);
    return rng.frac() < 0.5;
  }

  preload() {
    const sprite = getSprite(this.player.battler);
    this.load.spritesheet("player", sprite.spriteFile, {
      frameWidth: 16,
      frameHeight: 18,
    });
  }

  create() {
    const mapWidth = 20;
    const mapHeight = 15;

    this.map = new LevelMap(mapWidth, mapHeight);
    this.map.generate(this.mapSeed, this.isInterior);

    this.renderMap();
    this.createPlayer();
    this.setupCamera();
    this.setupControls();
    this.createAnimations();

    // Use the stored return position if it exists
    if (this.returnPosition) {
      this.playerSprite.setPosition(
        this.returnPosition.x,
        this.returnPosition.y,
      );
    }
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

  private createAnimations() {
    if (!this.animsCreated) {
      const createAnim = (key: string, start: number, end: number) => {
        this.anims.create({
          key: key,
          frames: this.anims.generateFrameNumbers("player", {
            start: start,
            end: end,
          }),
          frameRate: 10,
          repeat: -1,
        });
      };

      createAnim("walk-up", 0, 2);
      createAnim("walk-right", 6, 8);
      createAnim("walk-down", 0, 2);
      createAnim("walk-left", 3, 5);

      this.animsCreated = true;
    }
  }

  private playAnimation(key: string) {
    if (this.playerSprite.anims.currentAnim?.key !== key) {
      this.playerSprite.anims.play(key, true);
    }
  }

  private createPlayer() {
    this.playerSprite = this.physics.add.sprite(
      this.tileSize,
      this.tileSize,
      "player",
    );

    this.playerSprite.setDisplaySize(this.tileSize, this.tileSize);
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
      this.playAnimation("walk-left");
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
      this.playAnimation("walk-right");
    }

    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
      this.playAnimation("walk-up");
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
      this.playAnimation("walk-down");
    }

    this.playerSprite.setVelocity(velocityX, velocityY);

    if (velocityX === 0 && velocityY === 0) {
      this.playerSprite.anims.stop();
    }

    // Enable encounters after the player has moved
    if (!this.canEncounter && (velocityX !== 0 || velocityY !== 0)) {
      this.canEncounter = true;
    }

    // Check for dangerous tiles only if encounters are enabled
    if (this.canEncounter) {
      const playerTileX = Math.floor(this.playerSprite.x / this.tileSize);
      const playerTileY = Math.floor(this.playerSprite.y / this.tileSize);
      if (this.map.isDangerous(playerTileX, playerTileY)) {
        this.startEncounter();
      }
    }
  }

  private startEncounter() {
    // Stop the player's movement
    this.playerSprite.setVelocity(0, 0);

    const mapData: MapData = {
      seed: this.mapSeed,
      playerPosition: {
        x: this.playerSprite.x,
        y: this.playerSprite.y,
      },
    };

    // Transition to Battle or Encounter
    if (Math.random() < 0.05) {
      this.scene.start("Battle", { player: this.player, mapData });
    } else {
      this.scene.start("Encounter", { player: this.player, mapData });
    }
  }
}

export { LevelMap, MapScene };
