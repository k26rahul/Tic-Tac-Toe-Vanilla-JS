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
  <script>
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
  </script>
</template>`;
