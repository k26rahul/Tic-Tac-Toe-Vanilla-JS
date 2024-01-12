import { state, makeMove, resetState, makeAIMove } from './ticTacToeGame.js';
import { displayExclusive } from './utils.js';
import AchexWebSocket from './AchexWebSocket/AchexWebSocket.js';

window.state = state;

const achexWebSocket = new AchexWebSocket({ username: 'user_ql4TE9ja' });

achexWebSocket.on('CONNECTED', data => {});
achexWebSocket.onConnected(data => {});
achexWebSocket.onHubMessage(data => {});
achexWebSocket.onHubMessage(data => {});
achexWebSocket.onHubMessage(data => {});
achexWebSocket.on('CONNECTED', data => {});
achexWebSocket.on('CONNECTED', data => {});
achexWebSocket.on('CONNECTED', data => {});
achexWebSocket.on('CLOSED', data => {});
achexWebSocket.on('ERROR', data => {});
achexWebSocket.on('MESSAGE', data => {});
achexWebSocket.on('USER_MESSAGE', data => {});
achexWebSocket.on('SESSION_MESSAGE', data => {});
achexWebSocket.on('HUB_MESSAGE', data => {});
achexWebSocket.on('USER_LEFT_HUB', data => {});
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
  const confirmation = state.isGameOver
    ? true
    : window.confirm('Are you sure you want to restart the game?');
  if (confirmation) restart();
}

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
  handleCellClick(makeAIMove(true));
}

function handleCellClick(index) {
  if (!isMovePossible(index)) return;

  updateCell(index);
  makeMove(index);
  updateStatus();
  updateScore();
  highlightWinnerCells();

  if (gameMode === 'PvAI' && state.currentPlayer === 'X') {
    handleCellClick(makeAIMove(true));
  }
}

function updateCell(index) {
  const cellElement = cellElements[index];
  cellElement.textContent = getPlayerSymbol(state.currentPlayer);
  cellElement.classList.add(state.currentPlayer);
}

function updateStatus() {
  const { winner, isGameOver, currentPlayer } = state;
  const children = gameStatusElement.children;

  displayExclusive(
    children,
    element =>
      (winner && element.classList.contains('winner')) ||
      (isGameOver && !winner && element.classList.contains('draw')) ||
      (!isGameOver && element.classList.contains('turn'))
  );

  displayExclusive(
    children[0].children,
    element => element.classList.contains(winner),
    'initial'
  );
  displayExclusive(
    children[2].children,
    element => element.classList.contains(currentPlayer),
    'initial'
  );
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
  state.winningLine.forEach(index =>
    cellElements[index].classList.add('winner')
  );
}

function isMovePossible(index) {
  return !state.isGameOver && state.board[index] === null;
}

function getPlayerSymbol(player) {
  return player === 'X' ? playerXSymbol : playerOSymbol;
}
