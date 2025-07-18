#!/bin/bash

# Build the project
echo "Building with Nitro..."
NITRO_PRESET=netlify pnpm nitropack build

# Remove problematic files with # or ? characters
echo "Cleaning up problematic files..."
find .netlify -type f -name "*#*" -delete 2>/dev/null || true
find .netlify -type f -name "*\?*" -delete 2>/dev/null || true

# Also remove specific problematic directories
rm -rf .netlify/plugins/node_modules/es5-ext 2>/dev/null || true

echo "Build complete and cleaned!"
