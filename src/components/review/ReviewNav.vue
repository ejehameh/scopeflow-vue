<script setup>
import { ArrowLeft } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import ApproveButton from "@/components/ApproveButton.vue";
import AppLogo from "@/components/AppLogo.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
</script>

<template>
  <header class="border-b border-border bg-background shrink-0">
    <div class="flex h-14 items-center justify-between gap-4 px-6">
      <div class="flex items-center gap-3">
        <BaseButton as="router-link" to="/" variant="ghost" size="icon-sm" aria-label="Back to scope overview">
          <ArrowLeft class="size-4" />
        </BaseButton>
        <AppLogo project-name="Inventory Management System" />
        <BaseBadge
          variant="secondary"
          class="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700"
        >
          In Review
        </BaseBadge>
      </div>

      <div class="flex items-center gap-3">
        <ThemeToggle />
        <div class="flex -space-x-2">
          <UserAvatar letter="S" size="lg" title="Sarah" class="border-2 border-background" />
          <UserAvatar letter="A" size="lg" title="Alex" class="border-2 border-background" />
        </div>
        <ApproveButton size="default" />
      </div>
    </div>
  </header>
</template>
