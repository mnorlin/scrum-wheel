<script>
  import Wheel from "./lib/Wheel.svelte";
  import List from "./lib/List.svelte";
  import listStore from "./lib/store";
  import { fade } from "svelte/transition";
  import SpinButton from "./lib/SpinButton.svelte";
  import Timer from "./lib/Timer.svelte";

  let current = null;
  let rotation = 0;
  let wheelWidth = 500;
  let spinning = false;
  let activeTimer = false;
  let alert = false;

  $: if (!$listStore.includes(current)) {
    current = null;
  }

  function handleEnded(e) {
    current = e.detail;
    spinning = false;
    activeTimer = true;
  }

  function handleClick() {
    spinning = true;
    alert = false;
    activeTimer = false;
    $listStore = $listStore.filter((item) => item != current);
    rotation += 2 * Math.PI * 4 + Math.random() * 2 * Math.PI;
  }

  function handleFinishedTimer() {
    activeTimer = false;
    alert = true;
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
      <Wheel
        size={wheelWidth}
        on:ended={handleEnded}
        rotate={rotation}
        slices={$listStore}
      />
      <div
        class="spin-button-wrapper"
        class:disabled={spinning || $listStore.length < 2}
      >
        <SpinButton
          on:click={handleClick}
          disabled={spinning || $listStore.length < 2}
        />
      </div>
    </div>
  </div>
  <div class="right">
    <div class:alert>
      <Timer
        on:stop={() => (alert = false)}
        on:done={handleFinishedTimer}
        run={activeTimer}
        reset={spinning}
      />
    </div>
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
    min-width: 640px;
    min-height: 480px;
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
    flex-direction: column;
    gap: 1rem;
  }
  .wheel {
    position: relative;
  }

  .spin-button-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
  }

  .wheel:hover .spin-button-wrapper {
    transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
    transition-property: none;
    transition-duration: 1s;
    transform: translate(-50%, -50%) rotate(360deg);
  }

  .wheel:hover .spin-button-wrapper:not(.disabled) {
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

  @keyframes shake {
    0% {
      transform: scale(1);
    }
    14% {
      transform: scale(1.1);
    }
    21% {
      transform: scale(1.1) rotate(2deg);
    }
    28% {
      transform: scale(1.1) rotate(-2deg);
    }
    35% {
      transform: scale(1.1) rotate(2deg);
    }
    42% {
      transform: scale(1.1) rotate(-2deg);
    }
    49% {
      transform: scale(1.1) rotate(2deg);
    }
    56% {
      transform: scale(1.1);
    }
    70% {
      transform: scale(1);
    }
  }

  .alert {
    animation: shake 1.3s ease infinite;
  }
</style>
