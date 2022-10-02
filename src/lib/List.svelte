<script>
  import list from "./store";

  $: value = $list.join("\n");

  function handleInput(e) {
    const newValue = e.target.value;
    $list = newValue.split("\n").filter((v) => v !== "");
  }
</script>

<div class="wrapper">
  <h2 style:background-color="#434343">Entries</h2>
  <textarea style:border-color="#434343" on:input={handleInput} {value} />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  h2 {
    text-align: center;
    margin: 0;
    flex-grow: 0;
    padding: 0.75rem 0 0.5rem 0;
    color: white;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  textarea {
    margin: 0;
    font-family: sans-serif;
    display: flex;
    flex-grow: 1;
    border: 1px solid;
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 0.5rem;
    background-color: #fff;
    font-size: 1rem;
    box-sizing: border-box;
    resize: none;
  }
</style>
