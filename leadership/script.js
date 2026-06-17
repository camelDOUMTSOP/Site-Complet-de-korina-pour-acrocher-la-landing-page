document.addEventListener('DOMContentLoaded', function() {

  /* ---- Header scroll ---- */
  var header = document.querySelector('.ld-header');

  function handleScroll() {
    if (window.pageYOffset > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.ld-menu-toggle');
  var menu = document.querySelector('.ld-mobile-menu');
  var links = document.querySelectorAll('.ld-mobile-link');

  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      this.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow =
        menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight + 20 : 20;
        var pos = target.getBoundingClientRect().top +
                  window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });


  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.ld-reveal');

  function checkReveal() {
    var trigger = window.innerHeight * 0.88;
    reveals.forEach(function(el) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal, { passive: true });
  setTimeout(checkReveal, 100);


});