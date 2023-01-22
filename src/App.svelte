<script>
  import Wheel from "./lib/Wheel.svelte";
  import List from "./lib/List.svelte";
  import listStore from "./lib/store";
  import { fade } from "svelte/transition";

  let current = null;
  let rotation = 0;
  let wheelWidth = 500;
  let spinning = false;
  $: if ($listStore) {
    current = null;
  }

  function handleEnded(e) {
    current = e.detail;
    spinning = false;
  }
  function onSpin() {
    spinning = true;
    $listStore = $listStore.filter((item) => item != current);

    if (current) {
      setTimeout(() => {
        rotation += 360 * 4 + Math.random() * 360;
      }, 750);
    } else {
      rotation += 360 * 4 + Math.random() * 360;
    }
  }
</script>

<main>
  <div class="left" bind:clientWidth={wheelWidth}>
    <h1 transition:fade>
      {#if current && !spinning}
        <span transition:fade>{current}</span>
      {/if}
    </h1>
    <div class="wheel">
      <Wheel size={wheelWidth} on:ended={handleEnded} rotate={rotation} slices={$listStore} />
      <button disabled={spinning || $listStore.length == 0} on:click={onSpin}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
        <path
        fill-rule="evenodd"
        d="M 8,3 C 3.0062271,3.0019239 1.1016038,9.5150755 5.3040402,12.20885 9.5064765,14.902625 14.629402,10.452415 12.546,5.914 L 13.454,5.497 C 15.953999,10.943443 9.8056713,16.283527 4.7629207,13.050212 -0.27982994,9.8168977 2.0071925,2.0010187 8,2 Z"
     />
     <path
        d="m 8,4.466 v -3.932 0 L 10.865116,2.5 v 0 z"
        />
        </svg>
      </button>
    </div>
  </div>
  <div class="right">
    <List />
  </div>
</main>

<style>
  :root {
    --height: min(calc(100vh - 4rem), 66vw);
  }
  main {
    display: flex;
    margin: 2rem;
    align-items: stretch;
    justify-content: center;
    box-sizing: border-box;
    height: var(--height);
    width: calc(var(--height) * 1.333);
    box-sizing: border-box;
  }
  h1 {
    text-align: center;
    margin: 0;
    padding: 0;
    height: 4rem;
  }

  .left {
    width: 66%;
    height: 100%;
  }
  .right {
    width: 34%;
    display: flex;
  }
  .wheel {
    position: relative;
  }

  button {
    font-weight: bold;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    border: 1px solid black;
    filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
    transform: translate(-50%, -50%) rotate(0deg);
  }

  .wheel:hover button {
    transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
    transition-property: none;
    transition-duration: 1s;
    transform: translate(-50%, -50%) rotate(360deg);
  }

  .wheel:hover button:not(:disabled) {
    cursor: pointer;
    transition-property: transform;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -25%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -25%) rotate(360deg);
    }
  }
</style>
