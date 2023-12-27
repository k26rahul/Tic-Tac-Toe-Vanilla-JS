import { state, makeMove, resetState } from './ticTacToeGame.js';
window.state = state;

const playerXSymbol = 'X';
const playerOSymbol = 'O';
let XScore = 0;
let OScore = 0;
let drawScore = 0;

const statusElement = document.querySelector('.game-status');
const cellElements = document.querySelectorAll('.grid-cell');
const restartBtnElement = document.querySelector('.restart-btn');

const XScoreElement = document.querySelector(
  '.game-score-display.X .score-value'
);
const OScoreElement = document.querySelector(
  '.game-score-display.O .score-value'
);
const drawScoreElement = document.querySelector(
  '.game-score-display.draw .score-value'
);

restartBtnElement.addEventListener('click', () => {
  if (state.isGameOver) restart();
  else if (window.confirm('Are you sure you want to restart the game?'))
    restart();
});

restart();
function restart() {
  cellElements.forEach((cellElement, index) => {
    cellElement.textContent = '';
    cellElement.className = 'grid-cell';
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

function updateStatus() {
  if (state.winner) {
    setStatusText(`Player ${getPlayerSymbol(state.winner)} wins!`);
    return;
  }
  if (state.isGameOver) {
    setStatusText("Game over. It's a draw!");
    return;
  }
  setStatusText(`${getPlayerSymbol(state.currentPlayer)} Turn`);
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
