// An art roll involves three steps:
// 1. Roll 1d6 to identify the number of pieces in today's art
//     - If you just want one piece, use the first result
// 2. For each piece, pick the subject and style:
//     - Subject: Roll 1d6 because five chapters currently exist in Aria's Arc. 1-5 are the chapter from Aria's Arc, and 6 is "Not Aria's Arc"
//     - Style: 49% chance of pure style, 49% chance of modified style, and 2% chance of impossible style
//        - Pure styles just pick a base style.
//        - Modified style picks a base style and a modifier.
//        - Impossible style rolls 1d6 and picks that many styles randomly, regardless of whether they are base or modifier styles.

import { createTRPCRouter, publicProcedure } from "../trpc";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollArtStyle(styles: string[]): string {
  const roll = getRandomInt(0, styles.length - 1);
  const result = styles[roll];

  if (!result) throw new Error(`Invalid art style roll.`);

  return result;
}

function artRollFunction() {
  const baseStyles = [
    "Realism",
    "Impressionism",
    "Surrealism",
    "Analytical Cubism or Early Cubism",
    "Late Cubism or Post-Cubism",
    "Pop Art",
    "Art Nouveau",
    "Art Deco",
    "Expressionism",
    "Abstract Expressionism",
    "Fauvism",
    "Pointillism",
    "Minimalism",
    "Futurism",
    "Rococo",
    "Baroque",
    "Abstract Art",
    "Neo-Classicism",
    "Anime",
    "Comic Book Art",
    "Fantasy Art",
    "Arabesque",
    "Thangka",
    "Byzantine",
    "Mandala",
    "Iconographic",
    "Mural",
    "Chibi",
    "Tabletop Miniature",
    "Pop-up Book Art",
    "Stick Figures",
    "Ideographic Script",
    "Hieroglyphics",
    "Eastern Pictographic Writing",
    "Nahuatl",
  ];

  const modifierStyles = [
    "Charcoal",
    "Color Monochrome (Non-grayscale and declare the monochrome hue before drawing)",
    "Black and White, Sepia, Pyrography, or Grayscale (Declare which before drawing)",
    "Pixel Art",
    "Photorealism",
    "Sculpture",
    "Watercolor",
    "Pen and Ink",
    "Sketch",
    "Crayon",
    "Cartoon",
    "Origami",
    "Stained Glass",
    "Two-Tone Color Scheme",
    "Asymmetry",
    "with the image split into two parts",
    "with a circular split image",
    "Pyrography",
  ];

  const artRolls = [];
  const numberOfPieces = getRandomInt(1, 6);

  for (let i = 0; i < numberOfPieces; i++) {
    const artSubjects = [
      "Aria's Arc, Ch. 1",
      "Aria's Arc, Ch. 2",
      "Aria's Arc, Ch. 3",
      "Aria's Arc, Ch. 4",
      "Aria's Arc, Ch. 5",
      "Aria's Arc, Ch. 6",
      "Caelum's Arc, Ch. 1",
      "Lunara's Arc, Ch. 1",
      "Ezekiel's Arc, Ch. 1",
      "a TCG Card Back with a 7:5 aspect ratio. Feature a d20 die or hexagon (declare before drawing) and the letters 'AT'",
    ];
    const artSubject =
      artSubjects[Math.floor(Math.random() * artSubjects.length)];

    // Roll for the art style
    let artStyle = "";
    const styleRoll = Math.random();

    if (styleRoll < 0.49) {
      // Pure style
      artStyle = rollArtStyle(baseStyles);
    } else if (styleRoll < 0.98) {
      // Modified style
      artStyle = `${rollArtStyle(baseStyles)} with ${rollArtStyle(
        modifierStyles,
      )}`;
    } else {
      // Impossible style
      const numStyles = getRandomInt(1, 6);
      const combinedStyles = [];

      for (let j = 0; j < numStyles; j++) {
        combinedStyles.push(rollArtStyle([...baseStyles, ...modifierStyles]));
      }
      artStyle = combinedStyles.join(", ");
    }

    artRolls.push({ subject: artSubject, style: artStyle });
  }

  return artRolls;
}

export const artRouter = createTRPCRouter({
  getArtRoll: publicProcedure.query(() => {
    return artRollFunction();
  }),
});
