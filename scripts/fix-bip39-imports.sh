#!/bin/bash

# Script to fix @scure/bip39 wordlist import issues
# This addresses the common ESM import error with the ox package:
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/node_modules/@scure/bip39/wordlists/czech'

echo "🔍 Checking for BIP39 wordlist import issues..."

# Check if @scure/bip39 is installed
if [ ! -d "node_modules/@scure/bip39" ]; then
  echo "⚠️ @scure/bip39 package not found. Installing it first..."
  npm install @scure/bip39 --save
fi

# Check if ox package is installed
if [ ! -d "node_modules/ox" ]; then
  echo "⚠️ ox package not found. This fix is primarily for ox package users."
  echo "If you're experiencing the issue with another package, this may still help."
fi

echo "🔧 Applying BIP39 wordlist fix..."

# Run the JavaScript fixer script
node scripts/fix-bip39-wordlists.js

# Check if the script executed successfully
if [ $? -eq 0 ]; then
  echo "✅ BIP39 fix applied successfully!"
  echo "📝 If you still encounter issues, try:"
  echo "   1. Clear your node_modules cache: 'rm -rf node_modules/.cache'"
  echo "   2. Restart your development server"
  echo "   3. If the issue persists, you may need to clear node_modules and reinstall: 'rm -rf node_modules && npm install'"
  exit 0
else
  echo "❌ Failed to apply BIP39 fix"
  echo "Please try manually running: node scripts/fix-bip39-wordlists.js"
  exit 1
fi
