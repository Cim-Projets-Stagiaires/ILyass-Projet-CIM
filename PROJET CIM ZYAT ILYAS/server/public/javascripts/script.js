window.addEventListener('scroll', function() {
  var navbar = document.querySelector('.navbar__fixed');
  var scrollPosition = window.scrollY;

  if (scrollPosition > 120) {
    navbar.classList.add('is-visible');
  } else {
    navbar.classList.remove('is-visible');
  }
});
