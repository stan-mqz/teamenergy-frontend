import "../css/menu.style.css";

const lesson4Btn = document.getElementById("lesson-4-btn");
const lesson6Btn = document.getElementById("lesson-6-btn");

lesson4Btn.addEventListener("click", () => {
    window.location.href = "/section4.html";
});

lesson6Btn.addEventListener("click", () => {
    window.location.href = "/section6.html";
});