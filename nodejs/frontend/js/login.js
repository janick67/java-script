Cufon.replace('h1',{ textShadow: '1px 1px #fff'});
Cufon.replace('h2',{ textShadow: '1px 1px #fff'});
Cufon.replace('h3',{ textShadow: '1px 1px #000'});
Cufon.replace('.back');

  //the form wrapper (includes all forms)
const $form_wrapper	= $('#form_wrapper');
  //the current form is the one with class active
let  $currentForm	= $form_wrapper.children('form.active');
  //the change form links
let  $linkform	= $form_wrapper.find('.linkform');

//get width and height of each form and store them for later
$form_wrapper.children('form').each(function(i){
  var $theForm	= $(this);
  //solve the inline display none problem when using fadeIn fadeOut
  if(!$theForm.hasClass('active'))
    $theForm.hide();
    $theForm.data({
    width	: $theForm.width(),
    height	: $theForm.height()
  });
});

//set width and height of wrapper (same of current form)
setWrapperWidth();

/*
clicking a link (change form event) in the form
makes the current form hide.
The wrapper animates its width and height to the
width and height of the new current form.
After the animation, the new form is shown
*/
$linkform.bind('click',e => {
  var $link	= $(e.target);
  var target	= $link.attr('rel');
  $currentForm.fadeOut(200,function(){
      //remove class active from current form
      $currentForm.removeClass('active');
      //new current form
      $currentForm= $form_wrapper.children('form.'+target);
      //animate the wrapper
      $form_wrapper.stop()
             .animate({
              width	: $currentForm.data('width') + 'px',
              height	: $currentForm.data('height') + 'px'
            },250,function(){
              //new form gets class active
              $currentForm.addClass('active');
              //show the new form
              $currentForm.fadeIn(200);
             });
  });
  e.preventDefault();
});

function setWrapperWidth(){
  $form_wrapper.css({
    width	: $currentForm.data('width') + 'px',
    height	: $currentForm.data('height') + 'px'
  });
}

/*
for the demo we disabled the submit buttons
if you submit the form, you need to check the
which form was submited, and give the class active
to the form you want to show
*/

const uri = document.location.origin;

$form_wrapper.find('#login_btn').click(e => {
        e.preventDefault();
        const dane = {
          "email": $('#login_email').val(),
          "password": $('#login_password').val()
        }
        zaloguj(dane);
});

$form_wrapper.find('#register_btn').click(e => {
      e.preventDefault();
          const dane = {
          "username": $('#register_username').val(),
          "email": $('#register_email').val(),
          "password": $('#register_password').val()
      }
      zarejestruj(dane);
});


function zarejestruj(dane){
  post("/signup",dane).done(resp => {
    if (resp === "Zarejestrowano pomyślnie"){
      window.location.href = uri + '/logowanie/index.html';
    }else{
      $('form.register').addClass("bad");
    }});
}

function zaloguj(dane){
  post("/signin",dane).done(resp => {
    console.log("odpowiedź serwera:" + resp);
    if (resp === "Zalogowano pomyślnie"){
      console.log("siema, witam");
      window.location.href = uri + '/';
    }else{
      console.log("sorry, podaj prawidłowe dane logowania");
      $('form.login').addClass("bad");
    }});
}

function post(adres,dane){
  return $.ajax({
    method: "POST",
    url: uri + adres,
    data: JSON.stringify(dane),
    contentType : 'application/json',
    xhrFields: {
    withCredentials: true
  }});
}

/*

const uri = document.location.origin;


$('#btn_login').on('click', (e) =>{
  e.preventDefault();
  const dane = {
    "email": $('#email').val(),
    "password": $('#password').val()
  }
  zaloguj(dane);
});








function zaloguj(dane){
  console.log("dane wysyłane postem",dane);
  console.log("url", uri + '/login');
  $.ajax({
    method: "POST",
    url: uri + '/login',
    data: JSON.stringify(dane),
    contentType : 'application/json',
    xhrFields: {
    withCredentials: true
  }}).done(resp => {
    console.log(resp);
    if (resp === "Zalogowano pomyślnie"){
      window.location.href = uri + '/wydatki.html';
    }else{
      $('form').addClass("bad");
    }
  });
}*/
