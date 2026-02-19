<script setup>
defineProps({
  variant: {
    type: String,
    default: "default",
    validator: (v) =>
      ["default", "secondary", "destructive", "outline"].includes(v),
  },
  class: { type: String, default: "" },
});

const variantClasses = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive/10 text-destructive",
  outline: "border-border text-foreground",
};
</script>

<template>
  <span
    :class="[
      'h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0',
      variantClasses[variant],
      $props.class,
    ]"
  >
    <slot />
  </span>
</template>
