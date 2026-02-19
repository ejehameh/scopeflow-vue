<script setup>
import { ref, computed, watch, onBeforeUnmount, Teleport } from "vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 2 },
  autofocus: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const { numPages } = useComments();

const showPicker = ref(false);
const pickerFilter = ref("");
const pickerPos = ref(null);
const textareaRef = ref(null);
const pickerRef = ref(null);

const pages = computed(() =>
  Array.from({ length: numPages.value }, (_, i) => ({
    label: `Page ${i + 1}`,
    value: i + 1,
  })).filter((p) => p.label.toLowerCase().includes(pickerFilter.value))
);

function reposition() {
  if (!textareaRef.value) return;
  const rect = textareaRef.value.getBoundingClientRect();
  const pickerH = 155;
  const fitsAbove = rect.top > pickerH;
  pickerPos.value = {
    top: (fitsAbove ? rect.top - pickerH - 4 : rect.bottom + 4) + "px",
    left: rect.left + "px",
  };
}

function handleInput(e) {
  const v = e.target.value;
  emit("update:modelValue", v);
  const cursor = e.target.selectionStart;
  const before = v.slice(0, cursor);
  const atMatch = before.match(/@(\w*)$/);
  if (atMatch) {
    showPicker.value = true;
    pickerFilter.value = atMatch[1].toLowerCase();
    reposition();
  } else {
    showPicker.value = false;
  }
}

function insertMention(pageLabel) {
  const ta = textareaRef.value;
  if (!ta) return;
  const cursor = ta.selectionStart;
  const before = props.modelValue.slice(0, cursor);
  const after = props.modelValue.slice(cursor);
  const atIdx = before.lastIndexOf("@");
  const newVal = `${before.slice(0, atIdx)}@${pageLabel} ${after}`;
  emit("update:modelValue", newVal);
  showPicker.value = false;
  ta.focus();
}

function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey && !showPicker.value) {
    e.preventDefault();
    emit("submit");
  }
  if (e.key === "Escape") showPicker.value = false;
}

function handleClickOutside(e) {
  if (
    pickerRef.value && !pickerRef.value.contains(e.target) &&
    textareaRef.value && !textareaRef.value.contains(e.target)
  ) {
    showPicker.value = false;
  }
}

watch(showPicker, (val) => {
  if (val) {
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
  <div class="relative w-full">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :autofocus="autofocus"
      class="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      @input="handleInput"
      @keydown="handleKeyDown"
    />

    <Teleport to="body">
      <div
        v-if="showPicker && pages.length > 0 && pickerPos"
        ref="pickerRef"
        class="fixed w-48 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-lg"
        :style="{ top: pickerPos.top, left: pickerPos.left, zIndex: 9999 }"
      >
        <div class="p-1">
          <p class="px-2 py-1 text-xs font-medium text-muted-foreground">
            Mention a page
          </p>
          <button
            v-for="p in pages"
            :key="p.value"
            type="button"
            class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
            @mousedown.prevent="insertMention(p.label)"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
