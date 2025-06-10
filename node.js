const fs = require('fs');
const englishWords = require('english-words').english;
const words = JSON.parse(fs.readFileSync('words_b.json', 'utf-8'));

const dictionary = new Set(englishWords.map(w => w.toLowerCase()));
const filtered = words.filter(word =>
  word.length >= 3 &&
  word[0] === word[0].toLowerCase() &&
  dictionary.has(word.toLowerCase())
);

fs.writeFileSync('filtered_words_b.json', JSON.stringify(filtered, null, 2));
console.log('Done!');
