import { taskList } from './auth.js';

document.getElementById("add_btn").addEventListener("click", () => taskList.addItem());
document.getElementById("search").addEventListener("input", () => taskList.searchList());
document.getElementById("modal_close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    document.body.classList.remove("modal_open");
});