// Za pomocą nowej notacji stwórz obiekt literał translateToEN który zawiera:
// - właściwość wordsPL - tablica 5 słów po Polsku
// - właściwość wordsEN - tablica 5 słów po Angielsku
// - metodę translate - która przyjmie 1 parametr - pojedyncze słowo.
// Jeżeli to słowo znajduje się w tablicy wordsEN to metoda niech zwraca słowo o danym indeksie z tablicy wordsPL. Jeżeli danego słowa nie ma w tablicy wordsPL, funkcja niech zwraca "nieznane słowo"

const translateToEN = {
  wordsPL : ["nowe","stare","dobry","zły","wstydliwy"],
  wordsEN : ["new","old","good","bad","shy"],
  translate(a){
    let index = this.wordsEN.indexOf(a);
    return index > -1? this.wordsPL[index] : "nieznane słowo" ;
  }
}
console.log(translateToEN.translate("old"));


const translateToPL = Object.assign({},translateToEN);
translateToPL.translate = function(a){
    let index = this.wordsPL.indexOf(a);
    return index > -1? this.wordsEN[index] : "unknown word" ;
}

console.log(translateToPL.translate("wstydliwy"));
