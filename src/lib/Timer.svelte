<script>
  import { onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let run = false;
  export let reset = false;

  let paused = false;
  let active = false;
  let minutes;
  let seconds;
  loadTime();

  const dispatch = createEventDispatcher();

  $: minutes = formatTime(minutes);
  $: seconds = formatTime(seconds);

  $: if (run) active = true;
  $: if (reset) {
    active = false;
    pause = false;
    loadTime();
  }
  $: if (minutes == "00" && seconds == "00" && run) {
    dispatch("done");
  }

  const interval = setInterval(tick, 1000);
  onDestroy(() => clearInterval(interval));

  function loadTime() {
    const savedTime = localStorage.getItem("time");
    if (savedTime) {
      minutes = savedTime.split(":")[0];
      seconds = savedTime.split(":")[1];
    } else {
      minutes = "01";
      seconds = "00";
    }
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
    if (!run || paused) return;
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
    localStorage.setItem(
      "time",
      `${formatTime(minutes)}:${formatTime(seconds)}`
    );
  }
</script>

<div>
  <div style:width={run ? "70%" : "100%"}>
    <input
      class:active
      disabled={run && !paused}
      name="minutes"
      bind:value={minutes}
      on:input={save}
      type="text"
    />
    <span class:active>:</span>
    <input
      class:active
      disabled={run && !paused}
      name="seconds"
      bind:value={seconds}
      on:input={save}
      type="text"
    />
  </div>
  <button
    transition:fade={{ duration: 200 }}
    style:width={run ? "30%" : "0%"}
    disabled={!run}
    on:click={() => (paused = !paused)}
  >
    {paused ? "Resume" : "Pause"}
  </button>
</div>

<style>
  div {
    position: relative;
    color: rgb(223, 119, 57);
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
    color: rgb(223, 119, 57);
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
    color: rgb(223, 119, 57);
    background: transparent;
    border: none;
    padding: 0;
    transition: width 500ms ease;
  }
</style>
