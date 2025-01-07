import "../css/style.css";
import { darkModeWandler } from "./utils";
import { startGame } from "./game";

darkModeWandler();

const startGameBtn = document.getElementById("start-game");

startGameBtn.addEventListener("click", () => {
  startGame();
});
