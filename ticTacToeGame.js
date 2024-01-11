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

  const winnerResult = checkWinner(state.board);
  if (winnerResult) {
    state.winner = winnerResult.winner;
    state.winningLine = winnerResult.winningLine;
    state.isGameOver = true;
  } else if (isBoardFull(state.board)) {
    state.isGameOver = true;
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }
}

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

function checkWinner(board) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningLine: line,
      };
    }
  }
  return null;
}

function isBoardFull() {
  return state.board.every(cell => cell !== null);
}

function getPossibleMoves(board) {
  const possibleMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) possibleMoves.push(i);
  }
  return possibleMoves;
}

function makeAIMove(isMaximizing = true) {
  window.minimax_count = 0;
  console.time();
  const { bestMove, bestScore } = minimax(state.board, 10, isMaximizing);
  console.timeEnd();
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  window.minimax_count++;

  if (depth === 0 || isBoardFull(board)) {
    return { bestMove: null, bestScore: 0 };
  }

  const winnerResult = checkWinner(board);
  if (winnerResult) {
    return { bestMove: null, bestScore: winnerResult.winner === 'X' ? 1 : -1 };
  }

  const possibleMoves = getPossibleMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove;
    for (const move of possibleMoves) {
      const newBoard = [...board];
      newBoard[move] = 'X';

      const newBestScore = minimax(newBoard, depth - 1, false).bestScore;
      if (newBestScore > bestScore) {
        bestScore = newBestScore;
        bestMove = move;
      }
    }
    return { bestMove, bestScore };
  }

  if (!isMaximizing) {
    let bestScore = Infinity;
    let bestMove;
    for (const move of possibleMoves) {
      const newBoard = [...board];
      newBoard[move] = 'O';

      const newBestScore = minimax(newBoard, depth - 1, true).bestScore;
      if (newBestScore < bestScore) {
        bestScore = newBestScore;
        bestMove = move;
      }
    }
    return { bestMove, bestScore };
  }
}

export { state, makeMove, resetState, makeAIMove };
