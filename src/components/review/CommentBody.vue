<script setup>
import { computed } from "vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  text: { type: String, required: true },
});

const { scrollToPage } = useComments();

const MENTION_RE = /@(Page\s+\d+)/gi;

const parts = computed(() => {
  const result = [];
  let lastIndex = 0;
  for (const match of props.text.matchAll(MENTION_RE)) {
    const idx = match.index;
    if (idx > lastIndex) result.push({ type: "text", value: props.text.slice(lastIndex, idx) });
    const pageNum = parseInt(match[1].replace(/\D/g, ""), 10);
    result.push({ type: "mention", value: match[0], page: pageNum });
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < props.text.length) result.push({ type: "text", value: props.text.slice(lastIndex) });
  return result;
});
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <span v-if="part.type === 'text'">{{ part.value }}</span>
    <button
      v-else
      type="button"
      class="inline-flex cursor-pointer items-center gap-0.5 text-primary bg-primary/10 border border-primary/20 rounded px-1 py-0.5 text-xs font-medium hover:bg-primary/20 transition-colors mx-0.5 align-baseline"
      @click.stop="scrollToPage(part.page)"
    >
      {{ part.value }}
    </button>
  </template>
</template>
