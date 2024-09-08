import fs from "fs";
import path from "path";

// Function to replace template variables and insert component content
function buildFileFromTemplate(
  sourceTemplate: string,
  destination: string,
  replacements: Record<string, string>,
): void {
  if (fs.existsSync(sourceTemplate)) {
    let templateContent: string = fs.readFileSync(sourceTemplate, "utf-8");

    // Replace template variables with actual content
    for (const [key, value] of Object.entries(replacements)) {
      templateContent = templateContent.replace(
        new RegExp(`{{ ${key} }}`, "g"),
        value,
      );
    }

    // Replace template components with corresponding content
    templateContent = templateContent.replace(
      /{{ ([a-zA-Z0-9-_]+) }}/g,
      (match: string, componentName: string): string => {
        const componentPath: string = path.join("docs/src/components");

        // Find all files with the matching component name (regardless of extension)
        const componentFiles: string[] = fs
          .readdirSync(componentPath)
          .filter(
            (file: string) =>
              path.basename(file, path.extname(file)) === componentName,
          );

        if (componentFiles.length === 0) {
          console.warn(
            `Warning: Could not find component ${componentName} in docs/src/components`,
          );
          return match; // Keep the original placeholder if not found
        } else if (componentFiles.length > 1) {
          throw new Error(
            `Error: Multiple files found for component ${componentName} in docs/src/components. Component names must be unique.`,
          );
        }

        // Read the content of the matching component file (regardless of extension)
        const componentFile: string = componentFiles[0] ?? "";
        const componentContent: string = fs.readFileSync(
          path.join(componentPath, componentFile),
          { encoding: "utf-8" },
        );

        return componentContent;
      },
    );

    fs.writeFileSync(destination, templateContent, "utf-8");
  } else {
    console.warn(`Warning: Template file not found: ${sourceTemplate}`);
  }
}

// Function to recursively copy folders and files from source to destination, excluding components
function buildFoldersAndTemplateFiles(
  source: string,
  destination: string,
): void {
  if (fs.existsSync(source)) {
    if (fs.lstatSync(source).isDirectory()) {
      // Create the directory in the destination (if it doesn't exist)
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      // Process files and subdirectories, excluding components directory
      fs.readdirSync(source).forEach((file: string): void => {
        const filePath: string = path.join(source, file);
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

// Main execution: remove the dist folder if it exists, then build files and folders
if (fs.existsSync("docs/dist")) {
  fs.rmSync("docs/dist", { recursive: true, force: true });
}

buildFoldersAndTemplateFiles("docs/src", "docs/dist");
