//Rozwiązując kolejne punkty powinieneś z planszy usuwać kwadraty z danym numerem.
//Jeżeli dane kwadraty nie zostały usunięte, znaczy że polecenie nie zostało dobrze wykonane.

// 1. Znajdź elementy o klasie .first-attempt - dodaj im klasę active
// 2. Znajdź elementy z atrybutem data-border i dodaj im atrybut data-el-active. Wykorzystaj dataset i inny rodzaj pętli niż w 1 zadaniu
// 3. Znajdź elementy z klasą hack. Dodaj im atrybut title ustawiony na wartość "hacking". Ten atrybut nie ma mieć z przodu data-
// 4. Znajdź elementy o klasie hijack. Usuń im atrybut title
// 5. Znajdź elementy które mają 2 klasy równocześnie: st1 i st2. Dodaj im style: color: red, i font-size na 15px
// 6. Znajdź elementy które mają klasę .del ale nie mają klasy .hijack. Dodaj im atrybut data-hack-active, usuń atrybut data-hack-inactive
// 7. Znajdź elementy o klase .last-attempt i pokaż w ich wnętrzu spany

const arr1 = document.querySelectorAll(".first-attempt");
arr1.forEach(function(el){
  el.classList.add("active");
});

const arr2 = document.getElementsByTagName("div");
for (let i = 0; i < arr2.length; i ++){
  if (arr2[i].dataset.border !== undefined)
    arr2[i].dataset.elActive = "";
}

const arr3 = document.querySelectorAll(".hack");
arr3.forEach(function(el){
  el.setAttribute("title","hacking");
});

const arr4 = document.querySelectorAll(".hijack");
arr4.forEach(function(el){
  el.removeAttribute("title");
});

const arr5 = document.querySelectorAll(".st1.st2");
arr5.forEach(function(el){
  el.style.color = "red";
  el.style.fontSize = "15px";
});

const arr6  = document.querySelectorAll(".del:not(.hijack)");
arr6.forEach(function(el){
  el.dataset.hackActive = "";
  el.removeAttribute("data-hack-inactive");
});

const arr7 = document.querySelectorAll(".last-attempt");
arr7.forEach(function(el){
  el.querySelector("span").style.display = "none";
});
