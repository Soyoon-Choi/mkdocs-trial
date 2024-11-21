const floatingMenuButton = document.getElementById("floatingMenuButton");
const sideMenu = document.getElementById("sideMenu");

// 매뉴얼 확장 버튼 클릭 시 매뉴얼 리스트 보이기/숨기기
floatingMenuButton.addEventListener("click", () => {
sideMenu.classList.toggle("open");
});

// 매뉴얼 확장 버튼 클릭하거나 버튼 밖을 클릭 시 매뉴얼 리스트 닫기
document.addEventListener("click", (e) => {
if (!sideMenu.contains(e.target) && !floatingMenuButton.contains(e.target)) {
    sideMenu.classList.remove("open");
}
});