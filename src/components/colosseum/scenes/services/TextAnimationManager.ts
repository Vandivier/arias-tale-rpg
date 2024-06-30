import Phaser from "phaser";

type TextType = "typing" | "dialogue";

interface AnimationState {
  isSkipped: boolean;
  textObject: Phaser.GameObjects.Text;
  scene: Phaser.Scene;
  fullText: string;
  displayedText: string;
  index: number;
  onComplete?: () => void;
}

export class TextAnimationManager {
  private currentAnimation: ReturnType<typeof animateText> | null = null;
  private errorText: Phaser.GameObjects.Text | null = null;

  constructor(private scene: Phaser.Scene) {}

  clearCurrentText() {
    console.log("Clearing current text");
    if (this.currentAnimation) {
      this.currentAnimation.destroy();
      this.currentAnimation = null;
    }
    this.clearErrorText();
  }

  showNarrativeText(text: string, onComplete?: () => void) {
    console.log("showNarrativeText called with:", text);

    this.clearCurrentText();
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    try {
      this.currentAnimation = animateText(
        this.scene,
        centerX,
        centerY,
        text,
        "typing",
        {
          fontSize: "16px",
          color: "#fff",
          wordWrap: { width: 300 },
          align: "center",
        },
        () => {
          console.log("Text animation complete callback");
          if (onComplete) onComplete();
        },
      );
    } catch (error) {
      console.error("Error during text animation:", error);
    }
  }

  showErrorText(message: string) {
    this.clearErrorText();
    const centerX = this.scene.cameras.main.width / 2;
    const bottomY = this.scene.cameras.main.height - 20;

    this.errorText = this.scene.add
      .text(centerX, bottomY, message, {
        fontSize: "16px",
        color: "#ff0000",
        wordWrap: { width: this.scene.cameras.main.width * 0.8 },
        align: "center",
        backgroundColor: "#ffffff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.clearErrorText());
  }

  private clearErrorText() {
    if (this.errorText) {
      this.errorText.destroy();
      this.errorText = null;
    }
  }
}

function playSound(state: AnimationState, textType: TextType) {
  if (state.isSkipped || !state.scene.sound) return;
  const typingSounds = [
    "typingSound1",
    "typingSound2",
    "typingSound3",
    "typingSound4",
  ];
  const dialogueSounds = ["dialogSound1", "dialogSound2", "dialogSound3"];
  const soundArray = textType === "typing" ? typingSounds : dialogueSounds;
  const randomSound = Phaser.Math.RND.pick(soundArray);
  state.scene.sound.play(randomSound, { volume: 0.5 });
}

function animateNextCharacter(state: AnimationState, textType: TextType) {
  if (state.isSkipped) return;

  if (state.index < state.fullText.length) {
    if (state.fullText[state.index] !== " ") {
      playSound(state, textType);
    }
    state.displayedText += state.fullText[state.index];
    if (state.textObject?.scene) {
      state.textObject.setText(state.displayedText);
    } else {
      state.isSkipped = true;
      return;
    }
    state.index++;

    state.scene.time.delayedCall(100, () =>
      animateNextCharacter(state, textType),
    );
  } else {
    if (state.onComplete) state.onComplete();
  }
}

function skipAnimation(state: AnimationState) {
  if (state.isSkipped) return;
  state.isSkipped = true;
  state.scene.time.removeAllEvents();
  if (state.textObject?.scene) {
    state.textObject.setText(state.fullText);
  }
  if (state.onComplete) state.onComplete();
}

function animateText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  textType: TextType = "typing",
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
  onComplete?: () => void,
) {
  const textObject = scene.add.text(x, y, "", style).setOrigin(0.5);

  const state: AnimationState = {
    isSkipped: false,
    textObject,
    scene,
    fullText: text,
    displayedText: "",
    index: 0,
    onComplete,
  };

  const skipHandler = () => skipAnimation(state);
  const skipKey = scene.input.keyboard?.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE,
  );
  skipKey?.on("down", skipHandler);
  scene.input.on("pointerdown", skipHandler);

  scene.time.delayedCall(0, () => animateNextCharacter(state, textType));

  return {
    textObject,
    destroy: () => {
      state.isSkipped = true;
      scene.time.removeAllEvents();
      scene.input.off("pointerdown", skipHandler);
      skipKey?.off("down", skipHandler);
      if (state.textObject?.scene) {
        state.textObject.destroy();
      }
    },
  };
}
