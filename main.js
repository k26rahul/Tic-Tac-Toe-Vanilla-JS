import { state, makeMove, resetState } from './ticTacToeGame.js';
window.state = state;

const playerXSymbol = 'X';
const playerOSymbol = 'O';
let XScore = 0;
let OScore = 0;
let drawScore = 0;

const cellElements = document.querySelectorAll('.grid-cell');
const cellElementClassName = cellElements[0].className;

const XScoreElement = document.querySelector('.score-display.X .score-value');
const OScoreElement = document.querySelector('.score-display.O .score-value');
const drawScoreElement = document.querySelector(
  '.score-display.draw .score-value'
);
const restartBtnElement = document.querySelector('.restart-btn');
const gameStatusElement = document.querySelector('.game-status');

restartBtnElement.addEventListener('click', () => {
  if (state.isGameOver) restart();
  else if (window.confirm('Are you sure you want to restart the game?'))
    restart();
});

restart();
function restart() {
  cellElements.forEach((cellElement, index) => {
    cellElement.textContent = '';
    cellElement.className = cellElementClassName;
    cellElement.addEventListener('click', () => handleCellClick(index), {
      once: true,
    });
  });
  resetState();
  updateStatus();
}

function handleCellClick(index) {
  if (!isMovePossible(index)) return;
  updateCell(index);
  makeMove(index);
  updateStatus();
  updateScore();
  highlightWinnerCells();
}

function updateCell(index) {
  const cellElement = cellElements[index];
  cellElement.textContent = getPlayerSymbol(state.currentPlayer);
  cellElement.classList.add(state.currentPlayer);
}

function updateStatus() {
  [...gameStatusElement.children].forEach(element => {
    if (state.winner && element.classList.contains('winner')) {
      element.style.display = 'block';
      [...element.children].forEach(
        el =>
          (el.style.display = el.classList.contains(state.winner)
            ? 'initial'
            : 'none')
      );
      return;
    }
    if (
      state.isGameOver &&
      !state.winner &&
      element.classList.contains('draw')
    ) {
      element.style.display = 'block';
      return;
    }
    if (!state.isGameOver && element.classList.contains('turn')) {
      element.style.display = 'block';
      [...element.children].forEach(
        el =>
          (el.style.display = el.classList.contains(state.currentPlayer)
            ? 'initial'
            : 'none')
      );
      return;
    }
    element.style.display = 'none';
  });
}

function updateScore() {
  if (!state.isGameOver) return;

  if (state.winner === 'X') XScore++;
  else if (state.winner === 'O') OScore++;
  else drawScore++;

  XScoreElement.textContent = XScore;
  OScoreElement.textContent = OScore;
  drawScoreElement.textContent = drawScore;
}

function highlightWinnerCells() {
  if (!state.winner) return;
  state.winningLine.forEach(index => {
    cellElements[index].classList.add('winner');
  });
}

function isMovePossible(index) {
  return !state.isGameOver && state.board[index] === null;
}

function getPlayerSymbol(player) {
  return player === 'X' ? playerXSymbol : playerOSymbol;
}

function setStatusText(text) {
  statusElement.textContent = text;
}
