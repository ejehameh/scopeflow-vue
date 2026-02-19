<script setup>
defineProps({
  projectName: { type: String, default: "" },
});
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex size-9 items-center justify-center rounded-lg text-2xl font-bold bg-primary/10 text-primary"
    >
      S
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold text-foreground">ScopeFlow</span>
      <template v-if="projectName">
        <span class="text-muted-foreground">/</span>
        <span class="text-sm text-muted-foreground">{{ projectName }}</span>
      </template>
    </div>
  </div>
</template>
