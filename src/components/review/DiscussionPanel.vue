<script setup>
import { ref, watch } from "vue";
import { MessageSquare, MessageSquareText, Send } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import CommentThread from "./CommentThread.vue";
import MentionInput from "./MentionInput.vue";
import { useComments } from "@/composables/useComments";

const { comments, addComment } = useComments();

const newComment = ref("");
const listRef = ref(null);
const prevCount = ref(comments.value.length);

watch(() => comments.value.length, (len) => {
  if (len > prevCount.value) {
    listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: "smooth" });
  }
  prevCount.value = len;
});

function handleSubmit() {
  const trimmed = newComment.value.trim();
  if (!trimmed) return;
  addComment(trimmed);
  newComment.value = "";
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 pb-3 border-b border-border">
      <div class="flex size-8.5 items-center border justify-center rounded-lg text-primary">
        <MessageSquareText class="size-5" />
      </div>
      <h2 class="text-sm font-semibold text-foreground">Discussion</h2>
      <span
        v-if="comments.length > 0"
        class="size-2 rounded-full bg-destructive shrink-0"
        aria-label="New activity"
      />
      <span class="ml-auto text-xs text-muted-foreground">
        {{ comments.length }} thread{{ comments.length !== 1 ? "s" : "" }}
      </span>
    </div>

    <div ref="listRef" class="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
      <div
        v-if="comments.length === 0"
        class="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm"
      >
        <MessageSquare class="size-8 mb-2 opacity-40" />
        <p>No comments yet</p>
        <p class="text-xs mt-1">Highlight text on the PDF or add a comment below</p>
      </div>
      <CommentThread
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>

    <form class="pt-4 border-t border-border flex flex-col gap-2" @submit.prevent="handleSubmit">
      <MentionInput
        v-model="newComment"
        placeholder="Add a comment... (type @ to mention a page)"
        :rows="2"
        @submit="handleSubmit"
      />
      <div class="flex items-center justify-end">
        <BaseButton type="submit" size="sm" class="gap-1" :disabled="!newComment.trim()">
          <Send class="size-3.5" />
          Send
        </BaseButton>
      </div>
    </form>
  </div>
</template>
