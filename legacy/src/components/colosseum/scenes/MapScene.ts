import Phaser from "phaser";
import { type MapData, type PlayerCharacter } from "./types";
import { getSprite } from "./utils/main";

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
  private animsCreated: boolean = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isInterior!: boolean;
  private lastEncounterTile: { x: number; y: number } | null = null;
  private map!: LevelMap;
  private mapSeed!: number;
  private player!: PlayerCharacter;
  private playerSprite!: Phaser.Physics.Arcade.Sprite;
  private returnPosition?: { x: number; y: number };
  private safeMovesAfterEncounter: number = 2;
  private tileSize: number = 32;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

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

      createAnim("walk-up", 0, 1);
      createAnim("walk-right", 2, 3);
      createAnim("walk-down", 4, 5);
      createAnim("walk-left", 6, 7);

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

    const currentTileX = Math.floor(this.playerSprite.x / this.tileSize);
    const currentTileY = Math.floor(this.playerSprite.y / this.tileSize);

    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      if (this.map.isTraversable(currentTileX - 1, currentTileY)) {
        velocityX = -speed;
        this.playAnimation("walk-left");
      }
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      if (this.map.isTraversable(currentTileX + 1, currentTileY)) {
        velocityX = speed;
        this.playAnimation("walk-right");
      }
    }

    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      if (this.map.isTraversable(currentTileX, currentTileY - 1)) {
        velocityY = -speed;
        this.playAnimation("walk-up");
      }
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      if (this.map.isTraversable(currentTileX, currentTileY + 1)) {
        velocityY = speed;
        this.playAnimation("walk-down");
      }
    }

    this.playerSprite.setVelocity(velocityX, velocityY);

    if (velocityX === 0 && velocityY === 0) {
      this.playerSprite.anims.stop();
    }

    // Update current position after movement
    const newTileX = Math.floor(this.playerSprite.x / this.tileSize);
    const newTileY = Math.floor(this.playerSprite.y / this.tileSize);

    // Check if player has moved to a new tile
    if (
      this.lastEncounterTile &&
      (newTileX !== this.lastEncounterTile.x ||
        newTileY !== this.lastEncounterTile.y)
    ) {
      this.safeMovesAfterEncounter--;
      if (this.safeMovesAfterEncounter <= 0) {
        this.lastEncounterTile = null; // Reset cooldown
      }
    }

    // Check for dangerous tiles only if not in cooldown
    if (!this.lastEncounterTile && this.map.isDangerous(newTileX, newTileY)) {
      this.startEncounter();
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

    const currentTileX = Math.floor(this.playerSprite.x / this.tileSize);
    const currentTileY = Math.floor(this.playerSprite.y / this.tileSize);
    this.lastEncounterTile = { x: currentTileX, y: currentTileY };
    this.safeMovesAfterEncounter = 1;

    // Transition to Battle or Encounter
    if (Math.random() < 0.05) {
      this.scene.start("Battle", { player: this.player, mapData });
    } else {
      this.scene.start("Encounter", { player: this.player, mapData });
    }
  }
}

export { LevelMap, MapScene };
