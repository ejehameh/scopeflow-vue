<script setup>
import { FileText, MessageSquareText, Clock, DollarSign, Users, Calendar } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import ApproveButton from "@/components/ApproveButton.vue";
import AppLogo from "@/components/AppLogo.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

const details = [
  { icon: Users, label: "Client", value: "Alex - Logistics Co" },
  { icon: Calendar, label: "Timeline", value: "12 weeks" },
  { icon: DollarSign, label: "Investment", value: "£45,000" },
  { icon: Clock, label: "Sent", value: "Feb 18, 2026" },
];
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <!-- Nav -->
    <header class="border-b border-border bg-background shrink-0">
      <div class="flex h-14 items-center justify-between gap-4 px-6">
        <AppLogo project-name="Inventory Management System" />

        <div class="flex items-center gap-2">
          <ThemeToggle />

          <BaseButton as="router-link" to="/review" variant="outline" size="default" class="gap-1.5">
            <MessageSquareText class="size-4" />
            Review &amp; Comment
          </BaseButton>

          <ApproveButton size="default" />
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 min-h-0 overflow-y-auto bg-muted/30">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Project info strip -->
        <div class="py-5 border-b border-border">
          <div class="flex items-start justify-between gap-6">
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center border border-primary/20 rounded-xl text-primary shrink-0"
              >
                <FileText class="size-5" />
              </div>
              <div>
                <h1 class="text-lg font-semibold text-foreground leading-tight">
                  Inventory Management System
                </h1>
                <p class="text-sm text-muted-foreground">Scope of Work</p>
              </div>
            </div>

            <BaseBadge
              variant="outline"
              class="bg-amber-100 text-amber-600 border-amber-600 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-600/20 shrink-0 mt-1"
            >
              Awaiting Review
            </BaseBadge>
          </div>

          <div class="flex items-center gap-6 mt-4 justify-between px-2">
            <div
              v-for="d in details"
              :key="d.label"
              class="flex items-center gap-2 text-sm"
            >
              <component :is="d.icon" class="size-3.5 text-muted-foreground shrink-0" />
              <span class="text-muted-foreground">{{ d.label }}</span>
              <span class="font-medium text-foreground">{{ d.value }}</span>
            </div>
          </div>
        </div>

        <!-- PDF viewer -->
        <div class="pt-6">
          <iframe
            title="Scope of Work — Full Preview"
            src="/scope-of-work.pdf"
            class="w-full rounded-lg border border-border shadow-sm bg-white"
            :style="{ height: 'calc(100vh - 13rem)' }"
          />
        </div>
      </div>
    </main>
  </div>
</template>
