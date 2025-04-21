/**
 * Script to fix missing wordlist imports for @scure/bip39
 * This resolves the ESM import issue with ox package
 * 
 * The issue occurs because ox imports wordlists from @scure/bip39 without the .js extension:
 * Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/node_modules/@scure/bip39/wordlists/czech'
 * imported from '/node_modules/ox/esm/core/internal/mnemonic/wordlists.js'
 */

const fs = require('fs');
const path = require('path');

// Path to wordlists directory
const wordlistsDir = path.join(process.cwd(), 'node_modules', '@scure', 'bip39', 'wordlists');

// Create directory if it doesn't exist
if (!fs.existsSync(wordlistsDir)) {
  console.log('Creating wordlists directory');
  fs.mkdirSync(wordlistsDir, { recursive: true });
}

// List of languages to create wordlist files for
const languages = [
  'czech',
  'english',
  'french',
  'italian',
  'japanese',
  'korean',
  'portuguese',
  'spanish',
  'simplified-chinese',
  'traditional-chinese'
];

// Handle any errors during file creation
try {
  // Create wordlist files without .js extension to support ESM imports
  languages.forEach(lang => {
    const filePath = path.join(wordlistsDir, lang);
    const jsFilePath = path.join(wordlistsDir, `${lang}.js`);
    
    // Create non-extension file (regardless of whether JS file exists)
    // This ensures we properly handle the import even if structure changes
    if (!fs.existsSync(filePath)) {
      // Check if JS version exists
      if (fs.existsSync(jsFilePath)) {
        // Create a proxy file that exports from the JS version
        const content = `export { wordlist } from './${lang}.js';\nexport default { wordlist };\n`;
        fs.writeFileSync(filePath, content);
        console.log(`✓ Created ${lang} wordlist proxy file`);
      } else {
        // If the JS file doesn't exist, create an empty wordlist
        const emptyContent = `// ${lang} wordlist\nexport const wordlist = [];\nexport default { wordlist };\n`;
        fs.writeFileSync(filePath, emptyContent);
        console.log(`✓ Created empty ${lang} wordlist file`);
      }
    } else {
      console.log(`✓ ${lang} wordlist file already exists, skipping`);
    }
  });

  console.log('\n✅ BIP39 wordlist imports fixed successfully!');
  console.log('The ox package should now work correctly with ESM imports.');
} catch (error) {
  console.error('❌ Error fixing BIP39 wordlist imports:', error);
  process.exit(1);
}
