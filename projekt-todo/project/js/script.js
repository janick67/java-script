//Pierwszą rzeczą którą zrobimy to podpięcie się pod wysyłkę formularza.
// Gdy ktoś wyśle formularz, sprawdzimy czy treść nie jest pusta. Jeżeli tak jest,
//dodamy nowe zadanie do listy. Zadanie powinno zawierać tekst pobrany z formularza oraz
//datę dodania. Po dodaniu zadania do listy wyczyścimy treść w formularzu.

document.addEventListener('DOMContentLoaded', function() {

  const lista = document.querySelector("#todoList");
  const tresc = document.querySelector("#todoMessage");
  const formularz = document.querySelector("#todoForm");
  const search = document.querySelector("#todoSearch");

  formularz.addEventListener("submit",przy_wyslaniu)
  lista.addEventListener("click",usunEl)
  search.addEventListener("change",wyszukaj)


  function przy_wyslaniu(e)
  {
    e.preventDefault();
    if (tresc.value !== "")
    {
      lista.appendChild(stworz_el(tresc.value));
      tresc.value = "";
    }
  }

  function stworz_el(message)
  {
    const div1 = document.createElement("div");
    div1.classList.add("todo-element");

    const div2 = document.createElement("div");
    div2.classList.add("todo-element-bar");

    const h3 = document.createElement("h3");
    h3.classList.add("todo-element-date");
    h3.innerText = dajDate();

    const button = document.createElement("button");
    button.classList.add("todo-element-delete");
    button.title = "Usuń task";

    const i = document.createElement("i");
    i.classList.add("fas", "fa-times-circle");

    const divMessage = document.createElement("div");
    divMessage.classList.add("todo-element-text");
    divMessage.innerText = message;

    button.appendChild(i);
    div2.appendChild(h3);
    div2.appendChild(button);
    div1.appendChild(div2);
    div1.appendChild(divMessage);

    return div1;
  }

  function dajDate()
  {
    const data = new Date();
    let string = "";
    string += data.getDate() + "-";
    string += data.getMonth() + "-"
    string += data.getFullYear() + " ";
    string += data.getHours() + ":";
    string += data.getMinutes();
    return string;
  }

  function usunEl(e)
  {
    e.target.closest('.todo-element').remove();
  }

  function wyszukaj(e)
  {
    lista.querySelectorAll(".todo-element").forEach(function(el){
      text = el.querySelector(".todo-element-text");
      if (text.innerText.indexOf(e.target.value) == -1)
      el.style.display = "none";
      else
      el.style.display = "";
    });

  }
});
