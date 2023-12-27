import { state, makeMove, resetState } from './ticTacToeGame.js';
window.state = state;

const playerXSymbol = 'X';
const playerOSymbol = 'O';

const statusElement = document.querySelector('.game-status');
const cellElements = document.querySelectorAll('.grid-cell');

document.querySelector('.restart-btn').addEventListener('click', () => {
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

  if (state.winner) {
    highlightWinnerCells();
  }
}

function updateCell(index) {
  const cellElement = cellElements[index];
  cellElement.textContent = getPlayerSymbol(state.currentPlayer);
  cellElement.classList.add(state.currentPlayer);
}

function highlightWinnerCells() {
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
  setStatusText(`Current move: Player ${getPlayerSymbol(state.currentPlayer)}`);
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
