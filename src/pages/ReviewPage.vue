<script setup>
import ReviewNav from "@/components/review/ReviewNav.vue";
import DiscussionPanel from "@/components/review/DiscussionPanel.vue";
import PdfReviewView from "@/components/review/PdfReviewView.vue";
import OnboardingDialog from "@/components/review/OnboardingDialog.vue";
</script>

<template>
  <OnboardingDialog />
  <div class="flex h-screen flex-col bg-background">
    <ReviewNav />

    <div class="flex flex-1 min-h-0">
      <main class="flex-1 min-w-0 flex flex-col px-4 overflow-hidden border-r border-border">
        <PdfReviewView />
      </main>

      <aside class="w-96 shrink-0 border-border flex flex-col p-4 overflow-hidden bg-muted/20">
        <DiscussionPanel />
      </aside>
    </div>
  </div>
</template>
