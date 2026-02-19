<script setup>
import { ref, onMounted } from "vue";
import { Highlighter } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";

const STORAGE_KEY = "scopeflow-onboarding-seen";
const open = ref(false);

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    open.value = true;
  }
});

function handleDismiss() {
  localStorage.setItem(STORAGE_KEY, "true");
  open.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/20 backdrop-blur-sm"
        @click="handleDismiss"
      />

      <!-- Dialog -->
      <div class="relative z-10 bg-background ring-foreground/10 ring-1 rounded-xl p-6 w-full max-w-xl md:min-w-[700px] space-y-6 shadow-xl">
        <div class="text-left space-y-1.5">
          <h2 class="text-lg font-medium flex items-center gap-2">
            <div class="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
              <Highlighter class="size-5" />
            </div>
            Highlight text to comment
          </h2>
          <p class="text-muted-foreground text-sm">
            You can highlight any text on the document to leave a comment. Our team will see the highlight and can reply directly.
          </p>
        </div>

        <div class="rounded-lg overflow-hidden border border-border bg-black">
          <video
            src="/info-vid.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full"
          />
        </div>

        <div class="flex justify-end">
          <BaseButton class="min-w-32" @click="handleDismiss">
            Got it
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
