import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseURL = "https://ladderly.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDirectory: string = path.join(__dirname, "..", "src", "pages");
const appDirectory: string = path.join(__dirname, "..", "src", "app");
const publicDirectory: string = path.join(__dirname, "..", "public");

function checkAuthenticationRequired(filePath: string): boolean {
  const fileContents: string = fs.readFileSync(filePath, "utf8");
  return (
    fileContents.includes("authenticate = true") ||
    fileContents.includes("requireAuth()")
  );
}

function getPathsFromDirectory(directory: string): string[] {
  let paths: string[] = [];

  if (!fs.existsSync(directory)) {
    return paths;
  }

  const items: string[] = fs.readdirSync(directory);

  for (const item of items) {
    const fullPath: string = path.join(directory, item);
    const stat: fs.Stats = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      paths = [...paths, ...getPathsFromDirectory(fullPath)];
    } else if (stat.isFile()) {
      paths.push(fullPath);
    }
  }

  return paths;
}

const allPagePaths: string[] = getPathsFromDirectory(pagesDirectory);
const allAppPaths: string[] = getPathsFromDirectory(appDirectory);

function filePathToUrlPath(filePath: string, baseDir: string): string {
  const relativePath: string = path.relative(baseDir, filePath);
  return relativePath
    .replace(/\\/g, "/") // Replace backslashes with forward slashes for URL
    .replace(/\.(tsx|ts|js|jsx|md)$/, "") // Remove file extensions
    .replace(/(^|\/)index$/, "") // Remove 'index' from path for root pages
    .replace(/\/page$/, "") // Remove 'page' for App Router pages
    .replace(/\(auth\),?/, "");
}

function isValidPagePath(urlPath: string): boolean {
  const excludePatterns: string[] = [
    "api",
    "components",
    "_",
    "layout",
    "error",
    "loading",
    "not-found",
  ];
  return !excludePatterns.some((pattern) => urlPath.includes(pattern));
}

function getUrlsFromPaths(
  paths: string[],
  baseDir: string,
  isAppRouter: boolean = false,
): string[] {
  return paths
    .filter((filePath: string) => {
      if (
        isAppRouter &&
        !filePath.endsWith(".md") &&
        !filePath.endsWith("page.tsx") &&
        !filePath.endsWith("page.ts") &&
        !filePath.endsWith("page.js") &&
        !filePath.endsWith("page.jsx")
      ) {
        return false;
      }

      const urlPath: string = filePathToUrlPath(filePath, baseDir);
      return (
        !filePath.includes("[") &&
        !filePath.includes("]") &&
        !["_app", "_document", ".DS_Store", ".css"].some((exclude) =>
          filePath.includes(exclude),
        ) &&
        !checkAuthenticationRequired(filePath) &&
        isValidPagePath(urlPath)
      );
    })
    .map((filePath: string) => {
      const urlPath: string = filePathToUrlPath(filePath, baseDir);

      // Special handling for root page.tsx
      if (isAppRouter && (urlPath === "page" || urlPath === "")) {
        return baseURL;
      }

      return new URL(urlPath, baseURL).href;
    });
}

const pageUrls: string[] = getUrlsFromPaths(allPagePaths, pagesDirectory);
const appUrls: string[] = getUrlsFromPaths(allAppPaths, appDirectory, true);
const urls: string[] = [...new Set([...pageUrls, ...appUrls])].sort();
const sitemap: string = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((url: string) => `<url><loc>${url}</loc></url>`).join("\n  ")}
</urlset>`;

fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemap);
console.log(`Sitemap generated with ${urls.length} URLs`);
