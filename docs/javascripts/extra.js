document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('custom-nav');
    const toggleArrow = document.getElementById('toggle-arrow');
    const content = document.getElementById('page-content');  // 콘텐츠 영역 선택
  
    let isNavVisible = true;
  
    navToggle.addEventListener('click', function () {
      isNavVisible = !isNavVisible;
  
      if (isNavVisible) {
        nav.classList.remove('hidden');
        nav.classList.add('slide-in');
        nav.classList.remove('slide-out');
        toggleArrow.textContent = '←';  // Left arrow when sidebar is visible
        content.classList.remove('expanded');  // 콘텐츠 축소
      } else {
        nav.classList.remove('slide-in');
        nav.classList.add('slide-out');
        toggleArrow.textContent = '→';  // Right arrow when sidebar is hidden
        content.classList.add('expanded');  // 콘텐츠 확장
      }
    });
  });