<script setup>
defineProps({
  variant: {
    type: String,
    default: "default",
    validator: (v) =>
      ["default", "outline", "secondary", "ghost", "destructive", "link"].includes(v),
  },
  size: {
    type: String,
    default: "default",
    validator: (v) =>
      ["default", "xs", "sm", "lg", "icon", "icon-sm", "icon-lg"].includes(v),
  },
  disabled: { type: Boolean, default: false },
  as: { type: String, default: "button" },
});

defineEmits(["click"]);

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline:
    "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-xs",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost:
    "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  destructive:
    "bg-destructive/10 hover:bg-destructive/20 text-destructive",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses = {
  default: "h-9 gap-1.5 px-2.5",
  xs: "h-6 gap-1 rounded-sm px-2 text-xs",
  sm: "h-8 gap-1 rounded-md px-2.5",
  lg: "h-10 gap-1.5 px-2.5",
  icon: "size-9",
  "icon-sm": "size-8 rounded-md",
  "icon-lg": "size-10",
};
</script>

<template>
  <component
    :is="as"
    :class="[
      'cursor-pointer active:scale-95 rounded-md border border-transparent text-sm font-medium inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none select-none shrink-0',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>
