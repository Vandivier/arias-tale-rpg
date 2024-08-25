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
  private currentText: Phaser.GameObjects.Text | null = null;
  private isAnimationComplete: boolean = false;
  private fullText: string = "";
  private onCompleteCallback: (() => void) | null = null;
  private managedTextObjects: Set<Phaser.GameObjects.Text> = new Set();
  private currentAnimation: ReturnType<typeof animateText> | null = null;
  private animationQueue: (() => void)[] = [];
  private onTextClickCallback: (() => void) | null = null;

  constructor(
    private scene: Phaser.Scene,
    onTextClick?: () => void,
  ) {
    this.onTextClickCallback = onTextClick || null;
  }

  showNarrativeText(text: string, onComplete?: () => void) {
    console.log("showNarrativeText called with:", text);

    const animateNext = () => {
      this.clearCurrentText();

      const centerX = this.scene.cameras.main.width / 2;
      const centerY = this.scene.cameras.main.height / 2;

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
    };

    if (this.currentAnimation) {
      this.animationQueue.push(animateNext);
    } else {
      animateNext();
    }
  }

  clearCurrentText() {
    if (this.currentAnimation) {
      console.log("Clearing current text");
      if (this.currentAnimation.textObject?.scene) {
        this.currentAnimation.textObject.destroy();
      }
      this.currentAnimation = null;
    }
  }

  resetSkippedState() {
    if (this.currentAnimation) {
      this.currentAnimation.state.isSkipped = false;
      console.log("Reset skipped state for current animation");
    }
  }

  private processNextAnimation() {
    console.log("Processing next animation");
    this.clearCurrentText();
    this.currentAnimation = null;
    if (this.animationQueue.length > 0) {
      const nextAnimation = this.animationQueue.shift();
      if (nextAnimation) {
        console.log("Starting next animation");
        nextAnimation();
      }
    } else {
      console.log("No more animations in queue");
    }
  }

  makeTextClickable(textObject: Phaser.GameObjects.Text) {
    textObject
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleTextClick());
  }

  private handleTextClick() {
    if (this.isComplete()) {
      if (this.onTextClickCallback) {
        this.onTextClickCallback();
      }
    } else {
      this.completeCurrentAnimation();
    }
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

  isComplete(): boolean {
    return this.isAnimationComplete;
  }

  addManagedTextObject(textObject: Phaser.GameObjects.Text) {
    this.managedTextObjects.add(textObject);
  }

  removeManagedTextObject(textObject: Phaser.GameObjects.Text) {
    this.managedTextObjects.delete(textObject);
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
      console.log("Updated text:", state.textObject.text);
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
  const textObject = scene.add
    .text(x, y, "", {
      ...style,
      wordWrap: { width: 300 },
    })
    .setOrigin(0.5);
  textObject.name = `TAM_NarrativeText_${Date.now()}`;
  manager.addManagedTextObject(textObject);
  console.log("Created new managed text object:", textObject.name);
  console.log("Text object created:", textObject.text, "at position:", x, y);

  const state: AnimationState = {
    isComplete: false,
    isSkipped: false, // Reset for each new narrative segment
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
    console.log("Skipped. Full text set:", state.textObject.text);
  }
  if (state.onComplete) {
    console.log("Calling onComplete after skip");
    state.onComplete();
  }
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
