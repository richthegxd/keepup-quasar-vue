/**
 * * Convert the word to lowercase.
 * * Replace all non-alphanumeric characters with a dash.
 * * Replace all multiple dashes with a single dash.
 * * Return the result
 * @param word - The word you want to transliterate.
 * @returns The transliterated word.
 */
export default function translit(word) {
  const splittedWord = word.split("");

  const converter = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ь: "",
    ы: "y",
    ъ: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  
  let result = splittedWord.reduce((acc, letter) => {
    const formatedLetter = letter.toLowerCase();

    if (converter[formatedLetter]) {
      acc += converter[formatedLetter]; 
    } else {
      acc += formatedLetter;
    }
    
    return acc;
  }, "");

  result = result.replace(/[^-0-9a-z]/g, "-");
  result = result.replace(/[-]+/g, "-");

  return result;
}
