import fs from "fs";
import path from "path";

function copyFileRecursive(source: string, destination: string) {
  if (fs.existsSync(source)) {
    if (fs.lstatSync(source).isDirectory()) {
      // If source is a directory, create the directory in the destination
      fs.mkdirSync(destination, { recursive: true });

      // Copy all files and subdirectories recursively
      fs.readdirSync(source).forEach((file) => {
        copyFileRecursive(
          path.join(source, file),
          path.join(destination, file),
        );
      });
    } else {
      // If source is a file, copy it to the destination
      fs.copyFileSync(source, destination);
    }
  }
}

copyFileRecursive("docs/src", "docs/dist");
