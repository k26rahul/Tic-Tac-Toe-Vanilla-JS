import { html } from 'lit-html';

css`
  :root {
    --body-bg-color: #c9edff;
    --game-container-bg-color: beige;
    --grid-lines-color: #00334c;
    --winner-cell-bg-color: white;
    background-color: darkslategrey;
    border-radius: 0ex;
    border-radius: 0ex;
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

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    background-color: var(--body-bg-color);
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
`;

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
