const przyciski = document.querySelectorAll(".btn")


for (const el of przyciski)
{
  el.previousElementSibling.innerText = "(Nie widoczne)";

  el.addEventListener("click", function()
{
  const button = this;
  if (el.previousElementSibling.innerText == "(Widoczne)")
  {
    el.previousElementSibling.innerText = "(Nie widoczne)";
    el.parentElement.parentElement.lastElementChild.classList.remove("show");
  }
  else
  {
    el.previousElementSibling.innerText = "(Widoczne)";
    el.parentElement.parentElement.lastElementChild.classList.add("show");
  }
});
}

const el = document.createElement("div");

el.id = "myDiv";
el.innerText = "Tekst w divie";
el.setAttribute("title", "To jest tekst w dymku");
el.classList.add("module");
el.style.setProperty("background-color", "#FF6633");
document.body.appendChild(el);
