import Phaser from "phaser";

type TextType = "typing" | "dialogue";

interface AnimationState {
  isComplete: boolean;
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
  private managedTextObjects: Set<Phaser.GameObjects.Text>;

  constructor(private scene: Phaser.Scene) {
    this.managedTextObjects = new Set<Phaser.GameObjects.Text>();
  }

  clearCurrentText() {
    console.log("Clearing current text");
    if (this.currentAnimation) {
      this.currentAnimation.destroy();
      this.currentAnimation = null;
    }
    this.clearErrorText();

    this.managedTextObjects.forEach((textObject) => {
      console.log("Removing managed text object:", textObject.name);
      textObject.destroy();
    });
    this.managedTextObjects.clear();
  }

  isComplete() {
    return this.currentAnimation?.state.isComplete ?? false;
  }

  showNarrativeText(text: string, onComplete?: () => void) {
    console.log("showNarrativeText called with:", text);

    this.clearCurrentText();

    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    try {
      this.currentAnimation = animateText(
        this,
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
      this.makeTextClickable(this.currentAnimation.textObject);
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

    this.errorText.name = "TAM_ErrorText";
    this.managedTextObjects.add(this.errorText);
  }

  private clearErrorText() {
    if (this.errorText) {
      this.managedTextObjects.delete(this.errorText);
      this.errorText.destroy();
      this.errorText = null;
    }
  }

  addManagedTextObject(textObject: Phaser.GameObjects.Text) {
    this.managedTextObjects.add(textObject);
  }

  removeManagedTextObject(textObject: Phaser.GameObjects.Text) {
    this.managedTextObjects.delete(textObject);
  }

  skipCurrentAnimation() {
    if (this.currentAnimation) {
      this.currentAnimation.skip();
    }
  }

  completeCurrentAnimation() {
    if (this.currentAnimation) {
      this.currentAnimation.complete();
    }
  }

  makeTextClickable(textObject: Phaser.GameObjects.Text) {
    textObject
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.completeCurrentAnimation());
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
    if (state.fullText[state.index] !== " " && state.index % 2 === 0) {
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

    state.scene.time.delayedCall(40, () =>
      animateNextCharacter(state, textType),
    );
  } else {
    if (state.onComplete) state.onComplete();
  }
}

function animateText(
  manager: TextAnimationManager,
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  textType: TextType = "typing",
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
  onComplete?: () => void,
) {
  const textObject = scene.add.text(x, y, "", style).setOrigin(0.5);
  textObject.name = `TAM_NarrativeText_${Date.now()}`;
  manager.addManagedTextObject(textObject);
  console.log("Created new managed text object:", textObject.name);

  const state: AnimationState = {
    isComplete: false,
    isSkipped: false,
    textObject,
    scene,
    fullText: text,
    displayedText: "",
    index: 0,
    onComplete,
  };

  console.log("Starting text animation");
  scene.time.delayedCall(0, () => animateNextCharacter(state, textType));

  return {
    textObject,
    skip: () => {
      console.log("Skip method called");
      skipAnimation(state);
    },
    state,
    complete: () => {
      console.log("Complete method called");
      completeAnimation(state);
    },
    destroy: () => {
      state.isSkipped = true;
      scene.time.removeAllEvents();
      if (state.textObject?.scene) {
        console.log("Destroying managed text object:", state.textObject.name);
        manager.removeManagedTextObject(state.textObject);
        state.textObject.destroy();
      }
    },
  };
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

function completeAnimation(state: AnimationState) {
  if (state.isSkipped) return;
  state.isComplete = true;
  state.isSkipped = true;
  state.scene.time.removeAllEvents();
  if (state.textObject?.scene) {
    state.textObject.setText(state.fullText);
  }
  if (state.onComplete) state.onComplete();
}
