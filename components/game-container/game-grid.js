import { html } from 'lit-html';

html`<template>
  <section class="game-grid">
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
    <button class="grid-cell"></button>
  </section>
  <style>
    :root {
      --body-bg-color: #c9edff;
      --game-container-bg-color: beige;
      --grid-lines-color: #00334c;
      --winner-cell-bg-color: white;
    }

    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: inherit;
    }

    html,
    body {
      height: 100%;
    }
  </style>
  <script>
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
  </script>
</template>`;
