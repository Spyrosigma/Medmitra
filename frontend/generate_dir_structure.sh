#!/bin/bash
# filepath: /Users/namdev/Codes/Tunable/Unstructured_local/gen_str.sh

# Output file
OUTPUT_FILE="structure.md"

# Project directory (change this if needed)
PROJECT_DIR=$(pwd)

# Default ignore patterns
IGNORE_PATTERNS=".next|node_modules|.git|dist|build|out|target|venv|dumps"

# Check if additional patterns were provided
if [ $# -gt 0 ]; then
  # Add each argument to ignore patterns
  for pattern in "$@"; do
    IGNORE_PATTERNS="$IGNORE_PATTERNS|$pattern"
  done
fi

# Generate header
echo "# Project Directory Structure" > "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"

# Generate tree structure and append to file, excluding specified patterns
tree -a --dirsfirst --prune -I "$IGNORE_PATTERNS" "$PROJECT_DIR" >> "$OUTPUT_FILE"

echo "\`\`\`" >> "$OUTPUT_FILE"

echo "Directory structure saved in $OUTPUT_FILE"
echo "Ignored patterns: $IGNORE_PATTERNS"