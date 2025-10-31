.PHONY: all help instructions test lint format

# Default target executed when no arguments are given to make.
all: help

######################
# INSTRUCTIONS
######################

instructions:
	uv run python scripts/create-copilot-instructions.py

######################
# TESTING
######################

test:
	uv run --with-editable . pytest tests/

######################
# LINTING AND FORMATTING
######################

lint:
	uv run ruff check .
	uv run ruff format src/ tests/ scripts/ --diff
	uv run ruff check --select I src/ tests/ scripts/

format:
	uv run ruff format src/ tests/ scripts/
	uv run ruff check --select I --fix src/ tests/ scripts/

######################
# HELP
######################

help:
	@echo '----'
	@echo 'instructions                 - generate copilot-instructions.txt'
	@echo 'test                         - run unit tests'
	@echo 'lint                         - run linters'
	@echo 'format                       - run code formatters'

