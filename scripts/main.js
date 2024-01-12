import TicTacToeGame from './TicTacToeGame/TicTacToeGame.js';
import AchexWebSocket from './AchexWebSocket/AchexWebSocket.js';
import { displayExclusive } from './utils.js';

const achexWebSocket = new AchexWebSocket({ username: 'user_ql4TE9ja' });
console.log((window.achexWebSocket = achexWebSocket));

const playerXSymbol = '✖️';
const playerOSymbol = '⭕';
let XScore = 0;
let OScore = 0;
let drawScore = 0;
let gameMode = 'PvAI';

const cellElements = document.querySelectorAll('.grid-cell');
const cellElementClassName = cellElements[0].className;

const XScoreElement = document.querySelector('.score-cell.X .score-value');
const OScoreElement = document.querySelector('.score-cell.O .score-value');
const drawScoreElement = document.querySelector(
  '.score-cell.draw .score-value'
);
const restartBtnElement = document.querySelector('.restart-btn');
const gameStatusElement = document.querySelector('.game-status');

restartBtnElement.addEventListener('click', handleRestart);
function handleRestart() {
  const confirmation = ticTacToeGame.state.isGameOver
    ? true
    : window.confirm('Are you sure you want to restart the game?');
  if (confirmation) restart();
}

const ticTacToeGame = new TicTacToeGame();
window.state = ticTacToeGame.state;

restart();
function restart() {
  cellElements.forEach((cellElement, index) => {
    cellElement.textContent = '';
    cellElement.className = cellElementClassName;
    cellElement.addEventListener('click', () => handleCellClick(index), {
      once: true,
    });
  });

  ticTacToeGame.resetState();
  updateStatus();
  handleCellClick(ticTacToeGame.getAIMove(true));
}

function handleCellClick(index) {
  if (!ticTacToeGame.isMovePossible(index)) return;

  updateCell(index);
  ticTacToeGame.makeMove(index);
  updateStatus();
  updateScore();
  highlightWinnerCells();

  if (gameMode === 'PvAI' && ticTacToeGame.state.currentPlayer === 'X') {
    handleCellClick(ticTacToeGame.getAIMove(true));
  }
}

function updateCell(index) {
  const cellElement = cellElements[index];
  cellElement.textContent = getPlayerSymbol(ticTacToeGame.state.currentPlayer);
  cellElement.classList.add(ticTacToeGame.state.currentPlayer);
}

function updateStatus() {
  const { winner, isGameOver, currentPlayer } = ticTacToeGame.state;
  const children = gameStatusElement.children;

  displayExclusive(
    children,
    element =>
      (winner && element.classList.contains('winner')) ||
      (isGameOver && !winner && element.classList.contains('draw')) ||
      (!isGameOver && element.classList.contains('turn'))
  );

  displayExclusive(children[0].children, element =>
    element.classList.contains(winner)
  );

  displayExclusive(children[2].children, element =>
    element.classList.contains(currentPlayer)
  );
}

function updateScore() {
  if (!ticTacToeGame.state.isGameOver) return;

  if (ticTacToeGame.state.winner === 'X') XScore++;
  else if (ticTacToeGame.state.winner === 'O') OScore++;
  else drawScore++;

  XScoreElement.textContent = XScore;
  OScoreElement.textContent = OScore;
  drawScoreElement.textContent = drawScore;
}

function highlightWinnerCells() {
  const winningLine = ticTacToeGame.state.winningLine;
  if (!winningLine) return;
  winningLine.forEach(index => cellElements[index].classList.add('winner'));
}

function getPlayerSymbol(player) {
  return player === 'X' ? playerXSymbol : playerOSymbol;
}
