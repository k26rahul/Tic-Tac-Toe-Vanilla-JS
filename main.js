import DisplayController from './DisplayController.js';
import { state, makeMove, resetState } from './ticTacToeGame.js';
window.state = state;

const playerXSymbol = 'X';
const playerOSymbol = 'O';
let XScore = 0;
let OScore = 0;
let drawScore = 0;

const cellElements = document.querySelectorAll('.grid-cell');
const cellElementClassName = cellElements[0].className;

const restartBtnElement = document.querySelector('.restart-btn');
const XScoreElement = document.querySelector('.score-display.X .score-value');
const OScoreElement = document.querySelector('.score-display.O .score-value');
const drawScoreElement = document.querySelector(
  '.score-display.draw .score-value'
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

const gameStatusDisplayController = new DisplayController(
  document.querySelector('.game-status')
);

gameStatusDisplayController.displayExclusive(['winner', ['X']]);

const winnerStatusElement = document.querySelector('.game-status .winner');
const drawStatusElement = document.querySelector('.game-status .draw');
const turnStatusElement = document.querySelector('.game-status .turn .X');
const gameStatusDisplayManager = new DisplayController([
  winnerStatusElement,
  drawStatusElement,
  turnStatusElement,
]);

const winnerStatusXElement = winnerStatusElement.querySelector('.X');
const winnerStatusOElement = winnerStatusElement.querySelector('.O');
const winnerStatusDisplayManager = new DisplayController([
  winnerStatusXElement,
  winnerStatusOElement,
]);

const turnStatusXElement = turnStatusXElement.querySelector('.X');
const turnStatusOElement = turnStatusXElement.querySelector('.O');
const turnStatusDisplayManager = new DisplayController([
  turnStatusXElement,
  turnStatusOElement,
]);

function updateStatus() {
  if (state.winner) {
    gameStatusDisplayManager.displayExclusive(winnerStatusElement);
    winnerStatusDisplayManager.displayExclusive(
      state.currentPlayer === 'X' ? turnStatusXElement : turnStatusOElement
    );
    return;
  }
  if (state.isGameOver) {
    gameStatusDisplayManager.displayExclusive(drawStatusElement);
    return;
  }
  gameStatusDisplayManager.displayExclusive(turnStatusElement);
  turnStatusDisplayManager.displayExclusive(
    state.currentPlayer === 'X' ? turnStatusXElement : turnStatusOElement
  );
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
