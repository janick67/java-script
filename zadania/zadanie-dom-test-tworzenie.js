const list = document.querySelector(".list");
const fragment = document.createDocumentFragment();

const div = [];

for (let i = 0; i < 5; i++)
{
  div.push(document.createElement("div"));
  div[i].classList.add("element");
  div[i].title = "jestem divem numer " + i;
  div[i].innerText = "Element " + i;
  fragment.appendChild(div[i]);
}

list.appendChild(fragment);

document.querySelector('#delete').addEventListener('click', function() {
    //tutaj napisz usuwanie elementow w liscie
    if (list.children.length > 0)
    {
      div.shift().remove();
    }
    else
    {
        console.log("Nie mam co usunąc");
    }

});

document.querySelector('#add').addEventListener('click', function() {
  let i = div.length;
    div.push(document.createElement("div"));
    div[i].classList.add("element");
    div[i].title = "jestem divem numer " + i;
    div[i].innerText = "Element " + i;
    list.appendChild(div[i]);
});
