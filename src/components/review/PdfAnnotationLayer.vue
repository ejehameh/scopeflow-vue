<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Send } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import CommentPin from "./CommentPin.vue";
import MentionInput from "./MentionInput.vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  pageNumber: { type: Number, required: true },
});

const { comments, activePopupId, openPopup, closePopup, addComment } = useComments();

const pendingHighlight = ref(null);
const newCommentText = ref("");
const overlayRef = ref(null);

const pageComments = computed(() =>
  comments.value.filter(
    (c) => c.source === "annotation" && c.highlight?.pageNumber === props.pageNumber
  )
);

function rangeToPercentRects(range, container) {
  const containerRect = container.getBoundingClientRect();
  const clientRects = range.getClientRects();
  const result = [];
  for (let i = 0; i < clientRects.length; i++) {
    const r = clientRects[i];
    if (r.width < 2 || r.height < 2) continue;
    result.push({
      x: ((r.left - containerRect.left) / containerRect.width) * 100,
      y: ((r.top - containerRect.top) / containerRect.height) * 100,
      width: (r.width / containerRect.width) * 100,
      height: (r.height / containerRect.height) * 100,
    });
  }
  return result;
}

function handleMouseUp() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !overlayRef.value) return;

  const text = sel.toString().trim();
  if (!text) return;

  const range = sel.getRangeAt(0);
  const rangeParent = range.commonAncestorContainer;
  const overlay = overlayRef.value;
  if (!overlay.parentElement?.contains(rangeParent)) return;

  const containerRect = overlay.getBoundingClientRect();
  const rect = range.getBoundingClientRect();

  const x = ((rect.right - containerRect.left) / containerRect.width) * 100;
  const y = ((rect.top - containerRect.top) / containerRect.height) * 100;
  const rects = rangeToPercentRects(range, overlay);

  pendingHighlight.value = { text, x: Math.min(85, x), y: Math.min(90, y), rects };
  sel.removeAllRanges();
}

function submitAnnotation() {
  if (!pendingHighlight.value || !newCommentText.value.trim()) return;
  const highlight = {
    pageNumber: props.pageNumber,
    text: pendingHighlight.value.text,
    pinX: pendingHighlight.value.x,
    pinY: pendingHighlight.value.y,
    rects: pendingHighlight.value.rects,
  };
  addComment(newCommentText.value.trim(), highlight);
  pendingHighlight.value = null;
  newCommentText.value = "";
}

function cancelAnnotation() {
  pendingHighlight.value = null;
  newCommentText.value = "";
}

function onEsc(e) {
  if (e.key === "Escape") {
    cancelAnnotation();
    closePopup();
  }
}

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", onEsc);
});

onBeforeUnmount(() => {
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("keydown", onEsc);
});
</script>

<template>
  <div
    ref="overlayRef"
    class="absolute inset-0"
    style="pointer-events: none; z-index: 15"
  >
    <!-- Pending highlight rects -->
    <div
      v-for="(r, i) in pendingHighlight?.rects ?? []"
      :key="'pending-' + i"
      class="absolute bg-primary/20 rounded-sm"
      :style="{
        left: r.x + '%',
        top: r.y + '%',
        width: r.width + '%',
        height: r.height + '%',
        pointerEvents: 'none',
      }"
    />

    <!-- Existing comment pins -->
    <CommentPin
      v-for="c in pageComments"
      :key="c.id"
      :comment="c"
      :is-active="activePopupId === c.id"
      @open="openPopup(c.id)"
    />

    <!-- New annotation input -->
    <div
      v-if="pendingHighlight"
      class="absolute"
      :style="{
        left: pendingHighlight.x + '%',
        top: pendingHighlight.y + '%',
        pointerEvents: 'auto',
        zIndex: 9990,
      }"
    >
      <div class="w-72 rounded-lg border border-border bg-popover shadow-xl p-3 space-y-2">
        <p class="text-xs text-muted-foreground truncate">
          &ldquo;{{ pendingHighlight.text.slice(0, 60) }}{{ pendingHighlight.text.length > 60 ? "..." : "" }}&rdquo;
        </p>
        <MentionInput
          v-model="newCommentText"
          placeholder="Add a comment..."
          :rows="2"
          :autofocus="true"
          class="text-sm"
          @submit="submitAnnotation"
        />
        <div class="flex gap-2 justify-end">
          <BaseButton size="xs" variant="ghost" @click="cancelAnnotation">Cancel</BaseButton>
          <BaseButton
            size="xs"
            class="gap-1"
            :disabled="!newCommentText.trim()"
            @click="submitAnnotation"
          >
            <Send class="size-3" />
            Comment
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

