document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('custom-nav-toggle');
    const nav = document.getElementById('custom-nav');

    navToggle.addEventListener('click', function () {
      if (nav.style.display === 'none') {
        nav.style.display = 'block';
      } else {
        nav.style.display = 'none';
      }
    });
});