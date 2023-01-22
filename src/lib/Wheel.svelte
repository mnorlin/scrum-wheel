<script>
  import distinctColors from "distinct-colors";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import Slice from "./Slice.svelte";

  export let size = 500;
  export let slices = [];
  export let rotate = 0;
  export let duration = 5000;

  let animating = false;
  let startRotation = 0;
  let timer;
  $: endRotation = rotate;
  $: margin = 0.06 * size;
  $: {
    animating = true;
    timer = setTimeout(() => {
      animating = false;
      startRotation = endRotation;
      finished();
    }, duration);
  }

  onMount(() => {
    animating = false;
    clearTimeout(timer);
  });

  function finished() {
    const index = calculateSlice();
    const selected = slices[index];
    dispatch("ended", selected);
  }

  const dispatch = createEventDispatcher();

  function calculateSlice() {
    const sliceCount = slices.length;
    const sliceArc = (2 * Math.PI) / sliceCount;
    const offset = Math.PI / 2;
    const index = Math.floor((endRotation + offset) / sliceArc);
    return index % sliceCount;
  }

  $: colors =
    slices.length < 2
      ? [{ hex: () => "var(--gray)" }]
      : distinctColors({ count: slices.length });
  $: viewBox = `0 0 ${size} ${size}`;

  $: radius = (size - 2 * margin) / 2;
  $: basAngle = (2 * Math.PI) / slices.length;
</script>

<svg width={size} height={size} {viewBox}>
  <g
    style:transform-origin="center"
    style:--rotation="{endRotation}rad"
    style:animation-duration="{duration}ms"
    style:transform="rotate({startRotation}rad)"
    style:animation-name={animating ? "spin" : ""}
    style:animation-fill-mode="forwards"
    style:animation-timing-function="cubic-bezier(.2,0,0,1)"
  >
    <circle
      style:filter="drop-shadow(0px 0px 2px rgba(0,0,0,0.5))"
      r={radius}
      cx={radius + margin}
      cy={radius + margin}
      fill={colors[0].hex()}
    />
    {#if slices.length > 0}
      {#each slices as slice, idx (idx)}
        <Slice
          center={radius + margin}
          {radius}
          color={colors[idx].hex()}
          offsetAngle={idx * basAngle}
          angle={(2 * Math.PI) / (slices.length > 0 ? slices.length : 1)}
        >
          {slice}
        </Slice>
      {/each}
    {/if}
  </g>

  <polygon
    points="
      {size / 2 - size * 0.05},{margin - margin * 0.9}
      {size / 2 - size * 0.05},{margin - 5}
      {size / 2},{size * 0.06 + margin}
      {size / 2 + size * 0.05},{margin - 5}
      {size / 2 + size * 0.05},{margin - margin * 0.9}
      "
    fill="var(--light-gray)"
    style:backdrop-filter="blur(5px)"
    style:filter="drop-shadow(0px 4px 2px rgba(0,0,0,0.5))"
  />
</svg>

<style>
  @keyframes -global-spin {
    100% {
      transform: rotate(var(--rotation));
    }
  }
</style>
