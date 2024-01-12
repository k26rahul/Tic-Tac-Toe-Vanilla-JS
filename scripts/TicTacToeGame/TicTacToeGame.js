import {
  getPossibleMoves,
  checkWinner,
  isBoardFull,
  minimax,
} from './utils.js';

export default class TicTacToeGame {
  constructor() {
    this.state = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      isGameOver: false,
    };
  }

  resetState() {
    Object.assign(this.state, {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      isGameOver: false,
    });
  }

  makeMove(index) {
    this.state.board[index] = this.state.currentPlayer;

    const winnerResult = checkWinner(this.state.board);
    if (winnerResult) {
      this.state.winner = winnerResult.winner;
      this.state.winningLine = winnerResult.winningLine;
      this.state.isGameOver = true;
    } else if (isBoardFull(this.state.board)) {
      this.state.isGameOver = true;
    } else {
      this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  getAIMove(isMaximizing = true) {
    return minimax(this.state.board, 3, isMaximizing).bestMove;
  }

  isMovePossible(index) {
    return !this.state.isGameOver && this.state.board[index] === null;
  }
}
