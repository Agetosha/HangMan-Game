import { WORDS, KEYBOARD_LETTERS } from "./consts";

let gameDiv, logoH1, triesLeft, winCount;

document.addEventListener("DOMContentLoaded", () => {
  gameDiv = document.getElementById("game");
  logoH1 = document.getElementById("logo");
  triesLeft = 10;
  winCount = 0;
});

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("wordToGuess");
  const inputLetter = letter.toLowerCase();

  if (!word.includes(inputLetter)) {
    //буквы в слове нет
    const triesCounter = document.getElementById("tries-left");
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    //буква есть
    const wordArray = Array.from(word);
    let wrapperClassLetter = "letter";
    wordArray.forEach((el, i) => {
      if (el === inputLetter) {
        winCount += 1;
        if (winCount === wordArray.length) {
          stopGame("win");
        }
        const letterWrapper = document.getElementById(`letter-${i}`);
        if (wordArray.length > 14) {
          letterWrapper.classList.add("letter", "long-word");
          if (wordArray.length > 21) {
            letterWrapper.classList.add("longlong-word");
          }
        }
        letterWrapper.innerText = inputLetter.toUpperCase();
      }
    });
  }
};

const createPlaceholdersHTML = () => {
  const word = sessionStorage.getItem("wordToGuess");
  const wordArray = Array.from(word);

  let wrapperClass = "placeholders-wrapper";
  if (wordArray.length > 14) {
    wrapperClass = "placeholders-wrapper long-word";
    if (wordArray.length > 21) {
      wrapperClass = "placeholders-wrapper longlong-word";
    }
  }

  const placeholdersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter-${i}" class="letter">_</h1>`,
    ""
  );

  return `<div id="placeholders" class="${wrapperClass}">${placeholdersHTML}</div>`;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";
  return image;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class="button-primary keyboard-button" id="${curr}">${curr} </button>`
    );
  }, "");

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;
  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("wordToGuess", wordToGuess);

  gameDiv.innerHTML = createPlaceholdersHTML();

  gameDiv.innerHTML +=
    '<p id="tries" class="mt-5 font-bold text-xl">ОСТАЛОСЬ ПОПЫТОК: <span id="tries-left" class="font-bold text-xl text-red-600">10</span></p>';

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName == "BUTTON") {
      event.target.disabled = true;
      const letter = event.target.id;
      checkLetter(letter);
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button class="button-secondary px-2 py-1 mt-4" id="quit">Выйти</button>'
  );
  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Вы уверены, что хотите выйти и потерять прогресс?");
    if (isSure) {
      stopGame("quit");
    } else {
      return;
    }
  };
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("keyboard").remove();
  document.getElementById("tries").remove();

  let word = sessionStorage.getItem("wordToGuess");

  if (status === "win") {
    //победа
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById(
      "game"
    ).innerHTML += `<h2 class="result-header text-4xl font-bold text-green-600">ПОБЕДА</h2>`;
    document.getElementById("quit").remove();
  } else if (status === "lose") {
    //проигрыш
    gameDiv.innerHTML +=
      '<h2 class="result-header text-4xl font-bold text-red-600">ПОРАЖЕНИЕ</h2>';
    document.getElementById("quit").remove();
  } else if (status === "quit") {
    //выход
    document.getElementById("hangman-img").remove();
    document.getElementById("quit").remove();
  }
  word = word.toUpperCase();
  document.getElementById(
    "game"
  ).innerHTML += `<p class="text-1xl font-medium mt-5">Загаданное слово: <span id="result-word">${word}</span></p><button class="button-primary px-5 py-2 mt-10" id="restart-button">Начать заново</button>`;
  document.getElementById("restart-button").onclick = startGame;
};
