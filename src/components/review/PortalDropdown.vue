<script setup>
import { ref, watch, onBeforeUnmount, Teleport } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  triggerRef: { type: Object, default: null },
  width: { type: String, default: "w-44" },
});

const emit = defineEmits(["close"]);

const pos = ref(null);
const dropRef = ref(null);

function reposition() {
  if (!props.triggerRef) return;
  const rect = props.triggerRef.getBoundingClientRect();
  pos.value = {
    top: rect.bottom + 4 + "px",
    left: Math.max(8, rect.right - 180) + "px",
  };
}

function handleClickOutside(e) {
  if (
    dropRef.value && !dropRef.value.contains(e.target) &&
    props.triggerRef && !props.triggerRef.contains(e.target)
  ) {
    emit("close");
  }
}

watch(() => props.open, (val) => {
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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && pos"
      ref="dropRef"
      :class="['fixed rounded-md border border-border bg-popover shadow-lg p-1', width]"
      :style="{ top: pos.top, left: pos.left, zIndex: 9999 }"
    >
      <slot />
    </div>
  </Teleport>
</template>
