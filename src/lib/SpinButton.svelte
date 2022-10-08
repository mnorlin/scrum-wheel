<script>
  export let disabled = false;
</script>

<button {disabled} on:click>
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
    <path d="m 8,4.466 v -3.932 0 L 10.865116,2.5 v 0 z" />
  </svg>
</button>

<style>
  button {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    border: 1px solid var(--gray);
    color: rgba(0, 0, 0, 0.5);
    filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
  }

  button:not(:disabled) {
    cursor: pointer;
    color: rgba(0, 0, 0, 1);
  }
</style>
