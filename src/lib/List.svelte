<script>
  import list from "./store";
  import { onMount } from "svelte";

  let saveExists = false;
  $: value = $list.join("\n");

  function handleInput(e) {
    const newValue = e.target.value;
    $list = newValue.split("\n").filter((v) => v !== "");
  }

  function onSave() {
    localStorage.setItem("saved-list", JSON.stringify($list));
    saveExists = $list.length > 0;
  }

  onMount(() => {
    const saved = localStorage.getItem("saved-list");
    if (saved && JSON.parse(saved).length > 0) {
      saveExists = true;
    }
  });

  function onLoad() {
    const saved = localStorage.getItem("saved-list");
    if (saved) {
      $list = JSON.parse(saved);
    }
  }
</script>

<div class="wrapper">
  <div class="header">
    <h2>Entries</h2>
  </div>
  <textarea on:input={handleInput} {value} />
  <div class="footer">
    <button on:click={onSave}>Save entries</button>
    <button disabled={!saveExists} on:click={onLoad}>Load saved</button>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    flex-grow: 1;
  }
  .header,
  .footer {
    background-color: var(--gray);
    text-align: center;
    flex-grow: 0;
    color: white;
    padding: 0.5rem 0;
  }
  h2 {
    cursor: default;
    margin: 0.25rem 0 0 0;
  }
  textarea {
    margin: 0;
    font-family: sans-serif;
    display: flex;
    flex-grow: 1;
    border: 1px solid var(--gray);
    padding: 0.5rem;
    background-color: white;
    font-size: 1rem;
    box-sizing: border-box;
    resize: none;
  }

  textarea:focus {
    outline: none;
  }

  .footer button {
    margin: 0 0.25rem;
  }

  button {
    border-radius: var(--radius);
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: transparent;
    color: white;
    padding: 0.25rem 0.5rem;
    transition: border-color 200ms ease;
  }
  button:hover {
    border-color: rgba(255, 255, 255, 0.8);
  }

  button:disabled {
    opacity: 0.5;
  }

  button:not(:disabled) {
    cursor: pointer;
  }
</style>
