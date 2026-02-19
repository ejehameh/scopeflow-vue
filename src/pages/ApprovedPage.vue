<script setup>
import { onMounted } from "vue";
import confetti from "canvas-confetti";
import { MessageSquareText, ArrowLeft } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import AppLogo from "@/components/AppLogo.vue";
import AnimatedCheckIcon from "@/components/AnimatedCheckIcon.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

const nextSteps = [
  "The project team will receive your approval",
  "Phase 1 kickoff will be scheduled within 48 hours",
  "You'll receive a calendar invite for the first check-in",
];

onMounted(() => {
  const duration = 2500;
  const end = Date.now() + duration;
  const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#22c55e"];

  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
});
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <!-- Nav -->
    <header class="border-b border-border bg-background shrink-0">
      <div class="flex h-14 items-center justify-between gap-4 px-6">
        <AppLogo />
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <BaseButton as="router-link" to="/" variant="outline" size="default" class="gap-1.5">
            <ArrowLeft class="size-4" />
            Back to Scope
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="text-center max-w-md space-y-6">
        <AnimatedCheckIcon />

        <div class="space-y-2">
          <h1 class="text-2xl font-semibold text-foreground">Scope Approved!</h1>
          <p class="text-muted-foreground">
            You've approved the Scope of Work for the
            <span class="font-medium text-foreground">Inventory Management System</span>.
            The team has been notified and will begin work shortly.
          </p>
        </div>

        <div class="rounded-lg border border-border bg-muted/30 p-4 text-left space-y-3">
          <h2 class="text-sm font-semibold text-foreground">What happens next</h2>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li
              v-for="step in nextSteps"
              :key="step"
              class="flex items-start gap-2"
            >
              <span class="mt-1 text-primary">&#10003;</span>
              {{ step }}
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-center gap-3 flex-wrap">
          <BaseButton as="router-link" to="/" variant="outline" class="gap-1.5">
            <ArrowLeft class="size-4" />
            Back to Scope
          </BaseButton>
          <BaseButton as="router-link" to="/review" class="gap-1.5">
            <MessageSquareText class="size-4" />
            View Comments
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>
