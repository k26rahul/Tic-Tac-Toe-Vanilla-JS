export function checkWinner(board) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

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

export function getPossibleMoves(board) {
  const possibleMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) possibleMoves.push(i);
  }
  return possibleMoves;
}

export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

export function minimax(board, depth, isMaximizing) {
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
