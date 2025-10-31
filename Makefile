.PHONY: instructions

instructions:
	@echo "Finding and running create-copilot-instructions scripts..."
	@find . \( -name "create-copilot-instructions.py" -o -name "create-copilot-instructions.ts" \) -type f | while read script; do \
		script_dir=$$(dirname "$$script"); \
		project_root=$$(dirname "$$script_dir"); \
		script_name=$$(basename "$$script"); \
		script_ext=$$(echo "$$script" | sed 's/.*\.//'); \
		echo "Running $$script from $$project_root..."; \
		if [ "$$script_ext" = "py" ]; then \
			(cd "$$project_root" && uv run python "scripts/$$script_name" 2>/dev/null || python3 "scripts/$$script_name"); \
		elif [ "$$script_ext" = "ts" ]; then \
			(cd "$$project_root" && npx tsx "scripts/$$script_name" 2>/dev/null || tsx "scripts/$$script_name"); \
		fi; \
	done

