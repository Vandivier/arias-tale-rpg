import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import ignore from "ignore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readPackageJson(scriptPath: string): string {
  const scriptDir = path.dirname(scriptPath);
  // Project root is the parent of the scripts directory
  const projectRoot = path.dirname(scriptDir);
  const packageJsonPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return "No package.json file found in the project root.";
  }

  try {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    return packageJsonContent;
  } catch (error) {
    return `Error reading package.json file: ${error}`;
  }
}

function getFolderStructure(
  scriptPath: string,
  ignoreFile = ".gitignore",
): string {
  const scriptDir = path.dirname(scriptPath);
  // Project root is the parent of the scripts directory (where package.json is)
  const projectRoot = path.dirname(scriptDir);
  // Repo root is the parent of project root (where .gitignore is)
  const repoRoot = path.dirname(projectRoot);
  const gitignorePath = path.join(repoRoot, ignoreFile);

  let ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    try {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      ig.add(gitignoreContent);
    } catch (error) {
      // If we can't read .gitignore, continue without it
    }
  }

  const folderStructure: string[] = [];

  function walkDirectory(dirPath: string, relativePath: string): void {
    // Check if the current directory should be ignored (relative to repo root)
    // Add trailing slash for directory matching (gitignore patterns with trailing slash match directories)
    const relToRepoRoot =
      path.relative(repoRoot, dirPath).replace(/\\/g, "/") + "/";
    if (ig.ignores(relToRepoRoot)) {
      return; // Skip this directory entirely
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // Filter and sort directories
    const dirs = entries
      .filter((entry) => entry.isDirectory() && entry.name !== ".git")
      .map((entry) => entry.name)
      .sort();

    // Filter and sort files
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();

    // Add directory entry
    const relativeParts = relativePath ? relativePath.split(path.sep) : [];
    const indent =
      relativeParts.length > 0 ? "    ".repeat(relativeParts.length - 1) : "";
    const displayPath = relativePath
      ? `${relativePath.replace(/\\/g, "/")}/`
      : "./";
    folderStructure.push(`${indent}${displayPath}`);

    // Process subdirectories
    for (const dir of dirs) {
      const fullDirPath = path.join(dirPath, dir);
      const relDirPath = relativePath ? path.join(relativePath, dir) : dir;
      // Path relative to repo root for .gitignore matching (normalize to forward slashes)
      // Add trailing slash for directory matching
      const relToRepoRoot =
        path.relative(repoRoot, fullDirPath).replace(/\\/g, "/") + "/";

      // Check if directory should be ignored
      if (!ig.ignores(relToRepoRoot)) {
        walkDirectory(fullDirPath, relDirPath);
      }
    }

    // Process files
    for (const file of files) {
      const relFilePath = relativePath ? path.join(relativePath, file) : file;
      const fullFilePath = path.join(dirPath, file);
      // Path relative to repo root for .gitignore matching (normalize to forward slashes)
      const relToRepoRoot = path
        .relative(repoRoot, fullFilePath)
        .replace(/\\/g, "/");

      // Check if file should be ignored
      if (!ig.ignores(relToRepoRoot)) {
        const fileIndent = "    ".repeat(relativeParts.length);
        folderStructure.push(`${fileIndent}${file}`);
      }
    }
  }

  walkDirectory(projectRoot, "");

  // Remove the first element if it's "./"
  if (folderStructure.length > 0 && folderStructure[0] === "./") {
    folderStructure.shift();
  }

  return folderStructure.join("\n");
}

function createCopilotInstructions(): void {
  const scriptPath = __filename;
  const packageJsonContent = readPackageJson(scriptPath);
  const instructions =
    "Act as an expert AI engineer, software developer, and fullstack developer to help me resolve a concern. " +
    "\n" +
    "Here is the package.json file for this project which describes the dependencies:\n" +
    "```\n" +
    packageJsonContent +
    "\n```\n\n" +
    "Here is the folder structure of the project:\n" +
    getFolderStructure(scriptPath);

  const outputPath = path.join(__dirname, "copilot-instructions.txt");
  fs.writeFileSync(outputPath, instructions, "utf-8");

  console.log(`copilot-instructions.txt has been created at ${outputPath}.`);
}

createCopilotInstructions();
