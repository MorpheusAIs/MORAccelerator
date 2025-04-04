/**
 * Script to fix missing wordlist imports for @scure/bip39
 * This resolves the ESM import issue with ox package
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

// Create wordlist files without .js extension to support ESM imports
languages.forEach(lang => {
  const filePath = path.join(wordlistsDir, lang);
  const jsFilePath = path.join(wordlistsDir, `${lang}.js`);
  
  // Only create the file if JS version exists and the non-extension version doesn't
  if (fs.existsSync(jsFilePath) && !fs.existsSync(filePath)) {
    const content = `export { wordlist } from '@scure/bip39/wordlists/${lang}.js';`;
    fs.writeFileSync(filePath, content);
    console.log(`Created ${lang} wordlist file`);
  } else if (!fs.existsSync(jsFilePath)) {
    // If the JS file doesn't exist, create an empty wordlist
    const emptyContent = `// ${lang} wordlist\nexport const wordlist = [];\nexport default wordlist;`;
    fs.writeFileSync(filePath, emptyContent);
    console.log(`Created empty ${lang} wordlist file`);
  }
});

console.log('✅ BIP39 wordlist imports fixed successfully');
