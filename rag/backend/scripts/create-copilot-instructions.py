from pathlib import Path
import os

import pathspec


def read_pyproject_toml(script_path):
    """Reads and returns the full content of pyproject.toml located in the script's directory."""
    pyproject_toml_path = script_path.parent.parent / "pyproject.toml"

    if not pyproject_toml_path.exists():
        return "No pyproject.toml file found in the script directory."

    with open(pyproject_toml_path, "r") as file:
        try:
            pyproject_content = file.read()
            return pyproject_content
        except Exception as e:
            return f"Error reading pyproject.toml file: {e}"


def get_folder_structure(script_path, ignore_file=".gitignore"):
    """Generates a folder structure representation, respecting .gitignore with glob syntax, and always ignoring .git directory."""
    project_root = script_path.parents[2]
    gitignore_path = project_root / ignore_file

    ignored_paths = None
    if gitignore_path.exists():
        with open(gitignore_path, "r") as file:
            ignored_paths = pathspec.PathSpec.from_lines("gitwildmatch", file)

    folder_structure = []
    for dirpath, dirnames, filenames in os.walk(project_root):
        relative_path = Path(dirpath).relative_to(project_root)
        relative_path_parts = relative_path.parts

        # Always ignore .git directory
        if ".git" in dirnames:
            dirnames.remove(".git")

        # Ignore directories if they match .gitignore patterns
        # Use str(relative_path) for matching as pathspec expects strings
        if ignored_paths and ignored_paths.match_file(str(relative_path)):
            dirnames[:] = []  # Prevent traversal if the directory is ignored
            continue

        # Sort dirnames and filenames alphabetically
        dirnames.sort()
        filenames.sort()

        # Calculate indentation based on the depth
        indent = "    " * (len(relative_path_parts) - 1) if relative_path_parts else ""
        # Use '/' for consistent path separator display
        folder_structure.append(f"{indent}{relative_path.as_posix()}/")

        for filename in filenames:
            file_path = relative_path / filename
            file_path_parts = file_path.parts

            if not ignored_paths or not ignored_paths.match_file(str(file_path)):
                # Adjust indent for files
                file_indent = "    " * len(relative_path_parts)
                folder_structure.append(f"{file_indent}{filename}")

    # Remove the first element which is "./"
    if folder_structure and folder_structure[0] == "./":
        folder_structure.pop(0)

    return "\n".join(folder_structure)


def create_copilot_instructions():
    """Creates the copilot-instructions.txt file and prints pyproject.toml content to stdout."""
    script_path = Path(__file__).resolve()
    pyproject_content = read_pyproject_toml(script_path)
    instructions = (
        "Act as an expert AI engineer, software developer, and fullstack developer to help me resolve a concern. "
        "\n"
        "Here is the pyproject.toml file for this project which describes the dependencies:\n"
        f"```\n{pyproject_content}\n```\n\n"
        "Here is the folder structure of the project:\n"
        f"{get_folder_structure(script_path)}"
    )

    output_path = script_path.parent / "copilot-instructions.txt"
    with open(output_path, "w") as file:
        file.write(instructions)

    print(f"copilot-instructions.txt has been created at {output_path}.")


if __name__ == "__main__":
    create_copilot_instructions()
