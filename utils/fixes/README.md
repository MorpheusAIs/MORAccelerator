# BIP39 Wordlist ESM Import Fix

## Overview

This directory contains a script to fix an issue with ESM imports in the `ox` package when used with `@scure/bip39`.

## The Issue

When using the `ox` package with `@scure/bip39`, you might encounter this error:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/path/to/node_modules/@scure/bip39/wordlists/czech' imported from /path/to/node_modules/ox/_esm/core/internal/mnemonic/wordlists.js
Did you mean to import "@scure/bip39/wordlists/czech.js"?
```

This occurs because the `ox` package imports wordlists from `@scure/bip39` without the `.js` extension, which is required for ESM imports.

## The Fix

The `fix-bip39-wordlists.js` script creates the necessary files to resolve this issue. It:

1. Creates the wordlist files without `.js` extension
2. These files export from their counterparts with `.js` extension
3. For any missing wordlists, it creates empty arrays

## Usage

Add this to your `package.json` scripts:

```json
"scripts": {
  "postinstall": "node utils/fixes/fix-bip39-wordlists.js"
}
```

Alternatively, run it manually:

```
node utils/fixes/fix-bip39-wordlists.js
```

## Affected Packages

- `@scure/bip39`: BIP39 mnemonic implementation
- `ox`: Wallet connection utilities

## Related Dependencies

Make sure you have both packages installed:

```
npm install @scure/bip39 ox
```
