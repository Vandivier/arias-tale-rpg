import fs from "fs";
import path from "path";

const END_OF_INSTRUCTIONS_MARKER = "--END OF INITIAL INSTRUCTIONS--";

function buildFileFromTemplate(
  sourceTemplate: string,
  destination: string,
  replacements: Record<string, string>,
) {
  if (fs.existsSync(sourceTemplate)) {
    let templateContent = fs.readFileSync(sourceTemplate, "utf-8");

    // Replace template variables with actual content
    for (const [key, value] of Object.entries(replacements)) {
      templateContent = templateContent.replace(
        new RegExp(`{{ ${key} }}`, "g"),
        value,
      );
    }

    // Handle ttrpg-core content
    if (templateContent.includes("{{ ttrpg-core }}")) {
      const coreContentPath = path.join("docs/src/components", "ttrpg-core.md");
      if (fs.existsSync(coreContentPath)) {
        const coreContent = fs.readFileSync(coreContentPath, "utf-8");
        templateContent = templateContent.replace(
          "{{ ttrpg-core }}",
          coreContent,
        );
      } else {
        console.warn(
          `Warning: Could not find ttrpg-core content at ${coreContentPath}`,
        );
      }
    }

    // Replace end-of-instructions marker if present
    if (templateContent.includes("{{ end-of-instructions-marker }}")) {
      templateContent = templateContent.replace(
        "{{ end-of-instructions-marker }}",
        END_OF_INSTRUCTIONS_MARKER,
      );
    }

    fs.writeFileSync(destination, templateContent, "utf-8");
  } else {
    console.warn(`Warning: Template file not found: ${sourceTemplate}`);
  }
}

function buildFoldersAndTemplateFiles(source: string, destination: string) {
  if (fs.existsSync(source)) {
    if (fs.lstatSync(source).isDirectory()) {
      // Create the directory in the destination (if it doesn't exist)
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      // Process files and subdirectories, excluding components directory
      fs.readdirSync(source).forEach((file) => {
        const filePath = path.join(source, file);
        if (fs.lstatSync(filePath).isDirectory() && file !== "components") {
          buildFoldersAndTemplateFiles(filePath, path.join(destination, file));
        } else {
          const replacements: Record<string, string> = {}; // Replacements for the template

          // Handle files with .md extension (excluding components directory)
          if (
            path.extname(filePath) === ".md" &&
            !filePath.includes("components")
          ) {
            buildFileFromTemplate(
              filePath,
              path.join(destination, file),
              replacements,
            );
          }
        }
      });
    }
  }
}

// Delete contents of dist directory before building
if (fs.existsSync("docs/dist")) {
  fs.rmSync("docs/dist", { recursive: true, force: true });
}

// Example usage
buildFoldersAndTemplateFiles("docs/src", "docs/dist");
