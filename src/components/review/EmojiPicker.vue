<script setup>
import { ref, watch, onBeforeUnmount, Teleport } from "vue";
import { Smile } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";

const emit = defineEmits(["select"]);

const QUICK_EMOJIS = ["👍", "👎", "❤️", "😂", "🎉", "🤔", "👀", "🔥"];

const open = ref(false);
const btnRef = ref(null);
const pickerRef = ref(null);
const pos = ref(null);

function reposition() {
  if (!btnRef.value?.$el && !btnRef.value) return;
  const el = btnRef.value.$el || btnRef.value;
  const rect = el.getBoundingClientRect();
  const pickerH = 40;
  const fitsAbove = rect.top > pickerH + 8;
  pos.value = {
    top: (fitsAbove ? rect.top - pickerH - 4 : rect.bottom + 4) + "px",
    left: Math.max(8, rect.right - 110) + "px",
  };
}

function handleClickOutside(e) {
  const btnEl = btnRef.value?.$el || btnRef.value;
  if (
    pickerRef.value && !pickerRef.value.contains(e.target) &&
    btnEl && !btnEl.contains(e.target)
  ) {
    open.value = false;
  }
}

watch(open, (val) => {
  if (val) {
    reposition();
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

function pick(emoji) {
  emit("select", emoji);
  open.value = false;
}
</script>

<template>
  <BaseButton
    ref="btnRef"
    variant="ghost"
    size="icon-xs"
    class="text-muted-foreground"
    @click="open = !open"
  >
    <Smile class="size-3.5" />
  </BaseButton>

  <Teleport to="body">
    <div
      v-if="open && pos"
      ref="pickerRef"
      class="fixed rounded-md border border-border bg-popover shadow-lg p-1.5 flex gap-1"
      :style="{ top: pos.top, left: pos.left, zIndex: 9999 }"
    >
      <button
        v-for="e in QUICK_EMOJIS"
        :key="e"
        type="button"
        class="text-base cursor-pointer hover:scale-125 transition-transform p-0.5"
        @click="pick(e)"
      >
        {{ e }}
      </button>
    </div>
  </Teleport>
</template>
