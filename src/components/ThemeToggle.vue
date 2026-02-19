<script setup>
import { Moon, Sun } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useTheme } from "@/composables/useTheme";

const { theme, toggle } = useTheme();
</script>

<template>
  <BaseButton
    variant="ghost"
    size="icon-sm"
    :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
    @click="toggle"
  >
    <Moon v-if="theme === 'light'" class="size-4" />
    <Sun v-else class="size-4" />
  </BaseButton>
</template>
