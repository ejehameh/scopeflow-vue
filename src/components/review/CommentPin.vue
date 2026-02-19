<script setup>
import { ref, watch, nextTick, onBeforeUnmount, Teleport } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CommentPopup from "./CommentPopup.vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  comment: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
});

const emit = defineEmits(["open"]);

const { closePopup } = useComments();
const hovered = ref(false);
const previewHovered = ref(false);
const pinBtnRef = ref(null);
const popupPos = ref(null);
const previewPos = ref(null);

let hoverTimeout = null;

function showHover() {
  clearTimeout(hoverTimeout);
  hovered.value = true;
  nextTick(computePreviewPosition);
}

function hideHover() {
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    if (!previewHovered.value) {
      hovered.value = false;
      previewPos.value = null;
    }
  }, 150);
}

function onPreviewEnter() {
  clearTimeout(hoverTimeout);
  previewHovered.value = true;
}

function onPreviewLeave() {
  previewHovered.value = false;
  hideHover();
}

function onPreviewClick() {
  hovered.value = false;
  previewHovered.value = false;
  previewPos.value = null;
  emit("open");
}

function computeFloatingPos(popupW, popupH) {
  if (!pinBtnRef.value) return null;
  const rect = pinBtnRef.value.getBoundingClientRect();
  const gap = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fitsRight = rect.right + gap + popupW < vw;
  const fitsLeft = rect.left - gap - popupW > 0;

  let left;
  if (fitsRight) {
    left = rect.right + gap;
  } else if (fitsLeft) {
    left = rect.left - gap - popupW;
  } else {
    left = Math.max(8, (vw - popupW) / 2);
  }

  let top = rect.top;
  if (top + popupH > vh - 16) {
    top = Math.max(16, vh - popupH - 16);
  }

  return { top: top + "px", left: left + "px" };
}

function computePopupPosition() {
  popupPos.value = computeFloatingPos(320, 360);
}

function computePreviewPosition() {
  previewPos.value = computeFloatingPos(224, 100);
}

watch(() => props.isActive, (active) => {
  if (active) {
    hovered.value = false;
    previewHovered.value = false;
    previewPos.value = null;
    nextTick(computePopupPosition);
  } else {
    popupPos.value = null;
  }
});

onBeforeUnmount(() => {
  clearTimeout(hoverTimeout);
});
</script>

<template>
  <div v-if="comment.highlight" class="contents">
    <!-- Highlight rects on hover/active -->
    <template v-if="hovered || previewHovered || isActive">
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
        ref="pinBtnRef"
        type="button"
        :class="[
          'shadow-md cursor-pointer active:scale-95 p-1 rounded-t-full rounded-r-full border-2 transition-transform',
          comment.resolved
            ? 'size-8 flex items-center justify-center text-xs font-bold bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
            : 'bg-gray-800 border-none',
          isActive && 'ring-2 ring-primary ring-offset-2 scale-110',
        ]"
        @click.stop="isActive ? closePopup() : $emit('open')"
        @mouseenter="showHover"
        @mouseleave="hideHover"
      >
        <template v-if="comment.resolved">{{ comment.author.avatarLetter }}</template>
        <UserAvatar v-else :letter="comment.author.avatarLetter" />
      </button>
    </div>

    <!-- Hover preview — teleported to body -->
    <Teleport to="body">
      <div
        v-if="(hovered || previewHovered) && !isActive && previewPos"
        class="fixed w-56 rounded-md border border-border bg-popover shadow-lg p-2.5 cursor-pointer"
        :style="{ top: previewPos.top, left: previewPos.left, zIndex: 9980 }"
        @mouseenter="onPreviewEnter"
        @mouseleave="onPreviewLeave"
        @click.stop="onPreviewClick"
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
    </Teleport>

    <!-- Active popup — teleported to body -->
    <Teleport to="body">
      <div
        v-if="isActive && popupPos"
        class="fixed"
        :style="{ top: popupPos.top, left: popupPos.left, zIndex: 9999 }"
      >
        <CommentPopup :comment="comment" />
      </div>
    </Teleport>
  </div>
</template>
