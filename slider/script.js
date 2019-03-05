const Slider = function(elemSelector, opts) {
    const defaultOpts = {
        pauseTime : 0,
        prevText : "Poprzedni slide",
        nextText : "Następny slide",
        generatePrevNext: true,
        generateDots : true
    };
  this.options = Object.assign({}, defaultOpts, opts);
  this.currentSlide = 0; //aktualny slide
  this.sliderSelector = elemSelector; //selektor elementu który zamienimy na slider
  this.elem = null; //tutaj pobierzemy element który zamienimy na slider
  this.slider = null; //tutaj wygenerujemy slider
  this.slides = null; //tutaj pobierzemy slajdy
  this.prev = null; //przycisk prev
  this.next = null; //przycisk next
  this.dots = []; //przyciski kropek
  this.time = null;
  this.generateSlider();
  this.changeSlide(this.currentSlide);
}

Slider.prototype.generateSlider = function(){
  this.slider = document.querySelector(this.sliderSelector);
  this.slider.classList.add("slider");

  const slidesCnt = document.createElement("div");
  slidesCnt.classList.add('slider-slides-cnt');

  this.slides = this.slider.children;

  while(this.slides.length)
  {
    this.slides[0].classList.add('slider-slide');

    slidesCnt.appendChild(this.slides[0]);
  }

  this.slides = slidesCnt.querySelectorAll(".slider-slide");

  this.slider.appendChild(slidesCnt);
  if (this.options.generatePrevNext) this.createPrevNext();
  if (this.options.generateDots) this.createDots();
};


Slider.prototype.createPrevNext = function(){
  this.prev = document.createElement("button");
  this.prev.classList.add("slider-button", "slider-button-prev");
  this.prev.innerText = this.options.nextText;
  this.prev.type = "Button";
  this.prev.addEventListener("click",this.slidePrev.bind(this));

  this.next = document.createElement("button");
  this.next.classList.add("slider-button", "slider-button-next");
  this.next.innerText = this.options.prevText;
  this.next.type = "Button";
  this.next.addEventListener("click",this.slideNext.bind(this));

  const navi = document.createElement("div");
  navi.classList.add("slider-nav");
  navi.setAttribute('aria-label', 'Slider prev next');
  navi.appendChild(this.prev);
  navi.appendChild(this.next);
  this.slider.appendChild(navi);
};

Slider.prototype.createDots = function(){
  const ulDots = document.createElement("ul");
  ulDots.classList.add('slider-dots');
  ulDots.setAttribute('aria-label', 'Slider pagination');

  for(let i = 0; i < this.slides.length; i++)
  {
    const li = document.createElement("li");
    li.classList.add("slider-dots-element");

    const btn = document.createElement("button");
    btn.type = "Button";
    btn.classList.add("slider-dots-button");
    btn.innerText = i+1;
    btn.setAttribute("aria-label", "Zmien na " + i+1);
    btn.addEventListener("click", function(){
      this.changeSlide(i);
    }.bind(this));
    li.appendChild(btn);
    ulDots.appendChild(li);
    this.dots.push(li);
  }
  this.slider.appendChild(ulDots);
};

Slider.prototype.slideNext = function(){
  this.currentSlide++;
  if (this.currentSlide >= this.slides.length)
    this.currentSlide = 0;
  this.changeSlide(this.currentSlide);
}

Slider.prototype.slidePrev = function(){
  this.currentSlide--;
  if (this.currentSlide < 0)
    this.currentSlide = this.slides.length-1;
  this.changeSlide(this.currentSlide);
}

Slider.prototype.changeSlide = function(index){
  [].forEach.call(this.slides,function(slide){
    slide.classList.remove('slider-slide-active');
    slide.setAttribute("aria-hidden",true);
  });
  this.slides[index].classList.add('slider-slide-active');
  this.slides[index].setAttribute("aria-hidden",false);

  if(this.options.generateDots){
    [].forEach.call(this.dots,function(dot){
      dot.classList.remove('slider-dots-element-active');
    });
    this.dots[index].classList.add('slider-dots-element-active');
  }

  this.currentSlide = index;

  if (typeof this.options.pauseTime === "number" && this.options.pauseTime !== 0) {
      clearInterval(this.time);
      this.time = setTimeout(function() {
          this.slideNext();
      }.bind(this), this.options.pauseTime);
  }
}

const slide = new Slider("#slider1",{
pauseTime:5000,
nextText:"Dej go",
prevText:"Na zad"});
