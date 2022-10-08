<script>
  import { scale } from "svelte/transition";

  export let color = "";
  export let center = 0;
  export let radius = 0;
  export let offsetAngle = 0;
  export let angle = 0;

  $: dashArray = `0 ${radius * (Math.PI - angle / 2)} 0`;
</script>

<circle
  transition:scale
  r={radius / 2}
  cx={center}
  cy={center}
  fill="transparent"
  stroke={color}
  stroke-width={radius}
  stroke-dasharray={dashArray}
  style:transform-origin="center"
  style:transform="rotate(-{offsetAngle}rad)"
/>
<text
  style:font-size="max(calc(var(--height) * 0.04), 1.2rem)"
  style:font-weight="bold"
  style:transform="rotate(-{offsetAngle + (1 / 2) * angle}rad)"
  style:transform-origin="50%"
  stroke="rgba(0,0,0,0.3)"
  fill="rgba(255,255,255,1)"
  stroke-width="1px"
  x={center + 0.5 * radius}
  y={center}
  width={radius}
  dominant-baseline="middle"
  text-anchor="middle"
>
  <slot />
</text>
