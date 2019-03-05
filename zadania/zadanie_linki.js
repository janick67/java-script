const list = document.querySelector(".list");
list.classList.add("preety");
const li = document.querySelectorAll("li");
li[0].classList.add("first");
li[li.length-1].classList.add("last");
li[2].classList.add("active");
li[2].style.color = "#ffffff";

for (const el of li)
{
  el.title = "Przejdź na stronę " + el.querySelector("a").innerText;
  el.href = "#";
}


function HTMLInfo(selector)
 {
   this.selector = selector;
   this.elements = document.querySelectorAll(this.selector);
 }

HTMLInfo.prototype.showElements = function()
{
   for (const el of this.elements)
   {
     console.log(el);
   }
 }

HTMLInfo.prototype.showTags = function()
{
  for (const el of this.elements)
  {
    console.log(el.tagName);
  }
}

HTMLInfo.prototype.showCount = function()
{
  console.log(this.elements.length);
}

HTMLInfo.prototype.showClass = function()
{
  for (const el of this.elements)
  {
    console.log(el.className);
  }
}

HTMLInfo.prototype.showHtml = function()
{
  for (const el of this.elements)
  {
    console.log(el.innerHTML);
  }
}

HTMLInfo.prototype.showData = function()
{
  for (const el of this.elements)
  {
    console.log(el.dataset);
  }
}

const a = new HTMLInfo("li");
