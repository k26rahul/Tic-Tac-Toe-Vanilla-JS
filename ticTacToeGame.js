const winningLines = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  isGameOver: false,
};

function resetState() {
  Object.assign(state, {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    isGameOver: false,
  });
}

function makeMove(index) {
  state.board[index] = state.currentPlayer;
  if (checkWinner() || isBoardFull()) {
    state.isGameOver = true;
  }
  state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (
      state.board[a] &&
      state.board[a] === state.board[b] &&
      state.board[a] === state.board[c]
    ) {
      state.winner = state.board[a];
      state.winningLine = line;
      return true;
    }
  }
  return false;
}

function isBoardFull() {
  return state.board.every(cell => cell !== null);
}

export { state, makeMove, resetState };
