<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Loader2, CheckCheck } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps({
  size: { type: String, default: "default" },
  variant: { type: String, default: "default" },
});

const APPROVAL_DELAY_MS = 2000;
const isApproving = ref(false);
const router = useRouter();

function handleClick() {
  if (isApproving.value) return;
  isApproving.value = true;
  setTimeout(() => {
    router.push("/approved");
  }, APPROVAL_DELAY_MS);
}
</script>

<template>
  <BaseButton
    :variant="props.variant"
    :size="props.size"
    :disabled="isApproving"
    class="gap-1.5"
    @click="handleClick"
  >
    <template v-if="isApproving">
      <Loader2 class="size-4 animate-spin" />
      Approving…
    </template>
    <template v-else>
      <slot>
        <CheckCheck class="size-4" />
        Approve Scope
      </slot>
    </template>
  </BaseButton>
</template>
