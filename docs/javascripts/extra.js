const floatingMenuButton = document.getElementById("floatingMenuButton");
const sideMenu = document.getElementById("sideMenu");

// 햄버거 버튼 클릭 시 메뉴 보이기/숨기기
floatingMenuButton.addEventListener("click", () => {
sideMenu.classList.toggle("open");
});

// 메뉴를 클릭하거나 메뉴 밖을 클릭 시 메뉴 닫기
document.addEventListener("click", (e) => {
if (!sideMenu.contains(e.target) && !floatingMenuButton.contains(e.target)) {
    sideMenu.classList.remove("open");
}
});