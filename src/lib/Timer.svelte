<script>
  import { onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let run = false;
  export let reset = false;

  let minutes;
  let seconds;
  let paused = false; // If the timer is paused
  let disabled = "00:00" == `${getTimer().minutes}:${getTimer().seconds}`; // If the timer is disabled (set to 00:00)
  let active = false; // If the timer is active (running or paused)

  loadTimer();

  const dispatch = createEventDispatcher();

  $: minutes = formatTime(minutes);
  $: seconds = formatTime(seconds);

  $: if (run && !disabled) active = true;
  $: if (reset) {
    active = false;
    paused = false;
    loadTimer();
  }

  $: if (`${minutes}:${seconds}` == "00:00" && run) {
    if (!disabled) {
      dispatch("done");
    }
  }

  const interval = setInterval(tick, 1000);
  onDestroy(() => clearInterval(interval));

  function getTimer() {
    const savedTime = localStorage.getItem("time");
    if (savedTime) {
      return {
        minutes: savedTime.split(":")[0],
        seconds: savedTime.split(":")[1],
      };
    }
    return { minutes: "01", seconds: "00" };
  }
  function loadTimer() {
    minutes = getTimer().minutes;
    seconds = getTimer().seconds;
  }

  function formatTime(newValue) {
    let tmp = parseInt(newValue) || 0;
    if (tmp > 59) {
      tmp = 59;
    }
    if (tmp < 0) {
      tmp = 0;
    }

    return tmp.toString().length < 2 ? `0${tmp}` : tmp.toString().slice(-2);
  }

  function tick() {
    if (!active || paused) return;
    let parsedMin = parseInt(minutes);
    let parsedSec = parseInt(seconds);
    if (parsedSec == 0 && parsedMin > 0) {
      parsedMin -= 1;
      parsedSec = 59;
    } else if (parsedSec > 0) {
      parsedSec -= 1;
    }
    minutes = formatTime(parsedMin);
    seconds = formatTime(parsedSec);
  }

  function save() {
    const newTimer = `${formatTime(minutes)}:${formatTime(seconds)}`;
    localStorage.setItem("time", newTimer);

    if ("00:00" == newTimer) {
      disabled = true;
    } else {
      disabled = false;
    }
  }
</script>

<div>
  <div style:width={active ? "70%" : "100%"}>
    <input
      class:active
      disabled={active && !paused}
      name="minutes"
      bind:value={minutes}
      on:input={save}
      type="text"
    />
    <span class:active>:</span>
    <input
      class:active
      disabled={active && !paused}
      name="seconds"
      bind:value={seconds}
      on:input={save}
      type="text"
    />
  </div>
  <button
    transition:fade={{ duration: 200 }}
    style:width={active ? "30%" : "0%"}
    disabled={!active}
    on:click={active && `${minutes}:${seconds}` == "00:00"
      ? () => (reset = true && dispatch("stop"))
      : () => (paused = !paused)}
  >
    {#if active && `${minutes}:${seconds}` == "00:00"}
      Stop
    {:else}
      {paused ? "Resume" : "Pause"}
    {/if}
  </button>
</div>

<style>
  div {
    position: relative;
    color: var(--orange);
    display: flex;
    background-color: var(--gray);
    border-radius: var(--radius);
    font-weight: bold;
    line-height: 2rem;
    font-size: 2rem;
    transition: width 500ms ease;
  }
  span {
    margin-top: 0.7rem;
    color: white;
  }
  input {
    color: white;
    width: 50%;
    background: transparent;
    border: none;
    padding: 0.5rem 0.25rem;
    font-size: 2rem;
  }
  .active {
    color: var(--orange);
  }

  input:first-of-type {
    text-align: right;
  }
  input:last-of-type {
    text-align: left;
  }
  input:focus {
    outline: none;
  }

  button {
    overflow: hidden;
    cursor: pointer;
    color: var(--orange);
    background: transparent;
    border: none;
    padding: 0;
    transition: width 500ms ease;
  }
</style>
