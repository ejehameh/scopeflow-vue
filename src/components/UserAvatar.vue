<script setup>
const props = defineProps({
  letter: { type: String, required: true },
  size: { type: String, default: "md" },
  title: { type: String, default: "" },
});

const AVATAR_COLORS = {
  A: { bg: "bg-teal-700", text: "text-white" },
  S: { bg: "bg-red-800", text: "text-white" },
  B: { bg: "bg-indigo-700", text: "text-white" },
  C: { bg: "bg-amber-700", text: "text-white" },
  D: { bg: "bg-purple-700", text: "text-white" },
  E: { bg: "bg-emerald-700", text: "text-white" },
  F: { bg: "bg-rose-700", text: "text-white" },
};
const FALLBACK = { bg: "bg-slate-600", text: "text-white" };

const SIZE_CLASSES = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-9 text-xs",
};

const color = AVATAR_COLORS[props.letter.toUpperCase()] ?? FALLBACK;
</script>

<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center font-medium shrink-0',
      SIZE_CLASSES[size],
      color.bg,
      color.text,
    ]"
    :title="title"
    aria-hidden="true"
  >
    {{ letter.toUpperCase() }}
  </div>
</template>
