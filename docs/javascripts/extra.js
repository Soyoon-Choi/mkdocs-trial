document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const sidebar = document.querySelector('.md-sidebar--primary');
  const nav = document.getElementById('custom-nav');
  const scrollwrap = document.querySelector('.md-sidebar__scrollwrap');
  const toggleArrow = document.getElementById('toggle-arrow');

  let isNavVisible = true;

  navToggle.addEventListener('click', function () {
    isNavVisible = !isNavVisible;

    if (isNavVisible) {
      nav.classList.remove('slide-out');
      nav.classList.add('slide-in');
      sidebar.classList.add('open');   // 사이드바 열기
      toggleArrow.textContent = '«';  // Left arrow when sidebar is visible
      navToggle.style.left = '90%';   // 버튼을 오른쪽으로 이동
    } else {
      nav.classList.remove('slide-in');
      nav.classList.add('slide-out');
      sidebar.classList.remove('open');  // 사이드바 닫기
      toggleArrow.textContent = '»';  // Right arrow when sidebar is hidden
      navToggle.style.left = '0';     // 버튼을 왼쪽으로 이동
    }
  });
});