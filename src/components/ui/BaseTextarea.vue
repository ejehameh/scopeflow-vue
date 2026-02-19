<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 2 },
  autofocus: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :autofocus="autofocus"
    class="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
