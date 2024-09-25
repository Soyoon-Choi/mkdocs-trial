document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('custom-nav');
  const toggleArrow = document.getElementById('toggle-arrow');

  let isNavVisible = true;

  navToggle.addEventListener('click', function () {
    isNavVisible = !isNavVisible;

    if (isNavVisible) {
      nav.classList.remove('hidden');
      nav.classList.add('slide-in');
      nav.classList.remove('slide-out');
      toggleArrow.textContent = '«';  // Left arrow when sidebar is visible
      navToggle.style.left = '90%';  // Move button to right when visible
    } else {
      nav.classList.remove('slide-in');
      nav.classList.add('slide-out');
      toggleArrow.textContent = '»';  // Right arrow when sidebar is hidden
      navToggle.style.left = '0';  // Move button to left when hidden
    }
  });
});