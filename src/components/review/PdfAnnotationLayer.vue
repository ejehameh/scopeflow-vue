<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Send } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CommentPopup from "./CommentPopup.vue";
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

<script>
const CommentPin = {
  name: "CommentPin",
  components: { UserAvatar, CommentPopup },
  props: {
    comment: { type: Object, required: true },
    isActive: { type: Boolean, default: false },
  },
  emits: ["open"],
  setup(props, { emit }) {
    const { closePopup } = useComments();
    const hovered = ref(false);
    return { hovered, closePopup };
  },
  computed: {
    showHighlight() {
      return this.hovered || this.isActive;
    },
  },
  template: `
    <template v-if="comment.highlight">
      <!-- Highlight rects -->
      <template v-if="showHighlight">
        <template v-if="comment.highlight.rects.length > 0">
          <div
            v-for="(r, i) in comment.highlight.rects"
            :key="'hl-' + comment.id + '-' + i"
            :class="['absolute rounded-sm transition-opacity', isActive ? 'bg-primary/25' : 'bg-primary/15']"
            :style="{
              left: r.x + '%',
              top: r.y + '%',
              width: r.width + '%',
              height: r.height + '%',
              pointerEvents: 'none',
            }"
          />
        </template>
        <div
          v-else
          :class="['absolute inset-0 rounded-lg transition-opacity border-3', isActive ? 'border-primary/50' : 'border-primary/30']"
          style="pointer-events: none"
        />
      </template>

      <!-- Pin button -->
      <div
        class="absolute group"
        :style="{
          left: comment.highlight.pinX + '%',
          top: comment.highlight.pinY + '%',
          transform: 'translateY(-100%)',
          pointerEvents: 'auto',
          zIndex: isActive ? 9990 : 20,
        }"
      >
        <button
          type="button"
          :class="[
            'shadow-md cursor-pointer active:scale-95 p-1 rounded-t-full rounded-r-full border-2 transition-transform',
            comment.resolved
              ? 'size-8 flex items-center justify-center text-xs font-bold bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
              : 'bg-gray-800 border-none',
            isActive && 'ring-2 ring-primary ring-offset-2 scale-110',
          ]"
          @click.stop="isActive ? closePopup() : $emit('open')"
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
        >
          <template v-if="comment.resolved">{{ comment.author.avatarLetter }}</template>
          <UserAvatar v-else :letter="comment.author.avatarLetter" />
        </button>

        <!-- Hover preview -->
        <div
          v-if="hovered && !isActive"
          class="absolute left-10 top-0 w-56 rounded-md border border-border bg-popover shadow-lg p-2.5"
          style="z-index: 9980"
        >
          <div class="flex items-center gap-1.5">
            <UserAvatar :letter="comment.author.avatarLetter" size="xs" />
            <span class="text-xs font-medium">{{ comment.author.name }}</span>
            <span class="text-[10px] text-muted-foreground">{{ comment.timeAgo }}</span>
          </div>
          <p class="text-xs text-foreground/80 mt-1 line-clamp-2">{{ comment.body }}</p>
          <p v-if="comment.replies.length > 0" class="text-[10px] text-primary mt-1">
            {{ comment.replies.length }} repl{{ comment.replies.length === 1 ? 'y' : 'ies' }}
          </p>
        </div>

        <!-- Active popup -->
        <div v-if="isActive" class="absolute left-10 top-0" style="z-index: 9999">
          <CommentPopup :comment="comment" />
        </div>
      </div>
    </template>
  `,
};

export default { components: { CommentPin } };
</script>
