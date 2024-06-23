import Phaser from "phaser";

interface Character {
  sprite: Phaser.Physics.Arcade.Sprite;
  healthBar: Phaser.GameObjects.Rectangle;
  health: number;
  attack: (target: Character) => void;
  specialAttack: (target: Character) => void;
}

export class BattleScene extends Phaser.Scene {
  private player1!: Character;
  private player2!: Character;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private leftButton!: Phaser.GameObjects.Rectangle;
  private rightButton!: Phaser.GameObjects.Rectangle;
  private jumpButton!: Phaser.GameObjects.Rectangle;
  private attackButton!: Phaser.GameObjects.Rectangle;
  private specialButton!: Phaser.GameObjects.Rectangle;
  private difficulty!: string;

  constructor() {
    super("BattleScene");
  }

  create(data: { character: string; difficulty: string }) {
    const { width, height } = this.scale;
    this.difficulty = data.difficulty;

    this.add
      .image(width / 2, height / 2, "background")
      .setDisplaySize(width, height);

    this.player1 = this.createCharacter(
      data.character,
      width * 0.25,
      height * 0.7,
    );
    this.player2 = this.createCharacter(
      this.getRandomCharacter(),
      width * 0.75,
      height * 0.7,
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player1.sprite, this.player2.sprite);

    this.createMobileControls();

    // Add attack buttons for keyboard
    this.input.keyboard.on("keydown-A", () =>
      this.player1.attack(this.player2),
    );
    this.input.keyboard.on("keydown-S", () =>
      this.player1.specialAttack(this.player2),
    );

    // Set up AI based on difficulty
    this.setupAI();
  }

  createCharacter(type: string, x: number, y: number): Character {
    const sprite = this.physics.add.sprite(x, y, type.toLowerCase());
    sprite.setCollideWorldBounds(true);

    const healthBar = this.add.rectangle(x, y - 50, 100, 10, 0x00ff00);

    const character: Character = {
      sprite,
      healthBar,
      health: 100,
      attack: (target: Character) => this.characterAttack(character, target),
      specialAttack: (target: Character) =>
        this.characterSpecialAttack(character, target),
    };

    if (type === "Tank") {
      character.attack = (target: Character) =>
        this.tankAttack(character, target);
      character.specialAttack = (target: Character) =>
        this.tankSpecialAttack(character, target);
    } else if (type === "Eidolon") {
      character.attack = (target: Character) =>
        this.eidolonAttack(character, target);
      character.specialAttack = (target: Character) =>
        this.eidolonSpecialAttack(character, target);
    }

    return character;
  }

  getRandomCharacter(): string {
    return Math.random() < 0.5 ? "Tank" : "Eidolon";
  }

  createMobileControls() {
    const { width, height } = this.scale;
    const buttonSize = 50;
    const padding = 10;

    this.leftButton = this.add
      .rectangle(
        padding + buttonSize / 2,
        height - padding - buttonSize / 2,
        buttonSize,
        buttonSize,
        0x0000ff,
        0.5,
      )
      .setInteractive();
    this.rightButton = this.add
      .rectangle(
        padding * 2 + buttonSize * 1.5,
        height - padding - buttonSize / 2,
        buttonSize,
        buttonSize,
        0x0000ff,
        0.5,
      )
      .setInteractive();
    this.jumpButton = this.add
      .rectangle(
        width - padding - buttonSize / 2,
        height - padding - buttonSize / 2,
        buttonSize,
        buttonSize,
        0x00ff00,
        0.5,
      )
      .setInteractive();
    this.attackButton = this.add
      .rectangle(
        width - padding * 2 - buttonSize * 1.5,
        height - padding - buttonSize / 2,
        buttonSize,
        buttonSize,
        0xff0000,
        0.5,
      )
      .setInteractive();
    this.specialButton = this.add
      .rectangle(
        width - padding * 3 - buttonSize * 2.5,
        height - padding - buttonSize / 2,
        buttonSize,
        buttonSize,
        0xff00ff,
        0.5,
      )
      .setInteractive();

    this.leftButton.on("pointerdown", () => this.player1.setVelocityX(-160));
    this.leftButton.on("pointerup", () => this.player1.setVelocityX(0));
    this.rightButton.on("pointerdown", () => this.player1.setVelocityX(160));
    this.rightButton.on("pointerup", () => this.player1.setVelocityX(0));
    this.jumpButton.on("pointerdown", () => {
      if (this.player1.body.touching.down) {
        this.player1.setVelocityY(-330);
      }
    });
    this.attackButton.on("pointerdown", () =>
      this.attack(this.player1, this.player2),
    );
    this.specialButton.on("pointerdown", () =>
      this.specialAttack(this.player1, this.player2),
    );
  }

  setupAI() {
    let aiUpdateInterval: number;
    switch (this.difficulty) {
      case "easy":
        aiUpdateInterval = 2000; // AI updates every 2 seconds
        break;
      case "medium":
        aiUpdateInterval = 1000; // AI updates every 1 second
        break;
      case "hard":
        aiUpdateInterval = 500; // AI updates every 0.5 seconds
        break;
      default:
        aiUpdateInterval = 1000;
    }

    this.time.addEvent({
      delay: aiUpdateInterval,
      callback: this.updateAI,
      callbackScope: this,
      loop: true,
    });
  }

  updateAI() {
    const distance = Phaser.Math.Distance.Between(
      this.player1.sprite.x,
      this.player1.sprite.y,
      this.player2.sprite.x,
      this.player2.sprite.y,
    );

    if (distance < 100) {
      // If close, attempt to attack
      if (Math.random() < 0.7) {
        this.player2.attack(this.player1);
      } else {
        this.player2.specialAttack(this.player1);
      }
    } else {
      // If far, move towards the player
      this.player2.sprite.setVelocityX(
        this.player1.sprite.x < this.player2.sprite.x ? -160 : 160,
      );

      // Jump occasionally
      if (Math.random() < 0.1 && this.player2.sprite.body.touching.down) {
        this.player2.sprite.setVelocityY(-330);
      }
    }
  }

  update() {
    // Player movement (keyboard)
    if (this.cursors.left.isDown) {
      this.player1.sprite.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player1.sprite.setVelocityX(160);
    } else if (
      !this.leftButton.input.isDown &&
      !this.rightButton.input.isDown
    ) {
      this.player1.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player1.sprite.body.touching.down) {
      this.player1.sprite.setVelocityY(-330);
    }

    // Update health bars
    this.updateHealthBar(this.player1);
    this.updateHealthBar(this.player2);

    // Check for game over
    if (this.player1.health <= 0 || this.player2.health <= 0) {
      this.scene.start("GameOverScene", {
        winner: this.player1.health > 0 ? "Player 1" : "Player 2",
      });
    }
  }

  updateHealthBar(character: Character) {
    character.healthBar.setPosition(
      character.sprite.x,
      character.sprite.y - 50,
    );
    character.healthBar.setSize(character.health, 10);
  }

  characterAttack(attacker: Character, defender: Character) {
    const damage = 10;
    this.applyDamage(defender, damage);
  }

  characterSpecialAttack(attacker: Character, defender: Character) {
    const damage = 20;
    this.applyDamage(defender, damage);
  }

  tankAttack(attacker: Character, defender: Character) {
    const damage = 15;
    this.applyDamage(defender, damage);
    // Add spear thrust animation here
  }

  tankSpecialAttack(attacker: Character, defender: Character) {
    const damage = 25;
    this.applyDamage(defender, damage);
    // Add spinning spear attack animation here
  }

  eidolonAttack(attacker: Character, defender: Character) {
    const damage = 12;
    this.applyDamage(defender, damage);
    // Add bow shot animation here
  }

  eidolonSpecialAttack(attacker: Character, defender: Character) {
    const damage = 22;
    this.applyDamage(defender, damage);
    // Add multiple arrow shot animation here
  }

  applyDamage(character: Character, damage: number) {
    character.health = Math.max(0, character.health - damage);
    this.updateHealthBar(character);
  }
}
