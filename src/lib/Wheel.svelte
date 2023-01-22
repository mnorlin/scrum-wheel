<script>
  import distinctColors from "distinct-colors";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";

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
    const sliceArc = 360 / sliceCount;
    const offset = 90;
    const index = Math.floor((endRotation + offset) / sliceArc);
    return index % sliceCount;
  }

  $: colors = slices.length < 2 ? ([{hex: () => "#434343"}]) : distinctColors({ count: slices.length});
  $: viewBox = `0 0 ${size} ${size}`;

  $: radius = (size - 2 * margin) / 2;
  $: halfCircumference = Math.PI * radius;
  $: pieSize = halfCircumference * (slices.length > 0 ? 1 / slices.length : 1);
  $: dashArray = `0 ${halfCircumference - pieSize} ${pieSize}`;
  $: rotationStep = 360 / slices.length;
</script>

<svg width={size} height={size} {viewBox}>
  <g
    style:transform-origin="center"
    style:--rotation="{endRotation}deg"
    style:animation-duration="{duration}ms"
    style:transform="rotate({startRotation}deg)"
    style:animation-name={animating ? "spin" : ""}
    style:animation-fill-mode="forwards"
    style:animation-timing-function="cubic-bezier(.2,0,0,1)"
  >
    {#if slices.length > 0}
      {#each slices as slice, idx (idx)}
        <circle
          transition:scale
          data-title={slice}
          r={radius / 2}
          cx={radius + margin}
          cy={radius + margin}
          fill="transparent"
          stroke={colors[idx].hex()}
          stroke-width={radius}
          stroke-dasharray={dashArray}
          style:transform-origin="center"
          style:transform="rotate(-{idx * rotationStep}deg)"
        />
      {/each}
      {#each slices as slice, idx}
        <text
          style:font-size="calc(var(--height) * 0.04)"
          style:font-weight="bold"
          style:transform="rotate(-{rotationStep / 2 + idx * rotationStep}deg)"
          style:transform-origin="50%"
          stroke="rgba(0,0,0,0.3)"
          fill="rgba(255,255,255,1)"
          stroke-width="1px"
          x={radius * 1.5 + margin}
          y={radius + margin}
          width={radius}
          dominant-baseline="middle"
          text-anchor="middle"
        >
          {slice}
        </text>
      {/each}
    {:else}
      <circle r={radius} cx={radius + margin} cy={radius + margin} fill={colors[0].hex()} />
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
    fill="white"
    style:backdrop-filter="blur(5px)"
    style:filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.5))"
    stroke="black"
  />
</svg>

<style>
  @keyframes -global-spin {
    100% {
      transform: rotate(var(--rotation));
    }
  }
</style>
