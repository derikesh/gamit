const badWords = [
  // English
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'slut', 'whore', 'dick', 'cunt', 'pussy', 'porn', 'nigga', 'nigger', 'motherfucker',
  
  // Obfuscated/combined
  'fck', 'fuk', 'fux', 'mf', 'mofo', 'sh1t', 'b1tch', 'f*ck', 'f**k', 'b*tch', 'a55', 'c0ck', 'p0rn',

  // Nepali transliterations
  'chod', 'chodu', 'land', 'loda','lado', 'gand', 'randi', 'kutta', 'gadha', 'boka', 'randi', 'chikne', 'banchod', 'madarchod', 'khotey'];


  export function checkBadWord(username:string){

        const normalized = username.toLowerCase().replace(/[^a-z0-9]/gi, '');

        return !badWords.some( (words) => normalized.includes(words) );

  }