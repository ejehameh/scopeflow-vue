<script setup>
import { ref } from "vue";
import { Send } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import SingleComment from "./SingleComment.vue";
import MentionInput from "./MentionInput.vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  comment: { type: Object, required: true },
});

const { addReply, scrollToHighlight } = useComments();

const replyText = ref("");
const showReplyInput = ref(false);

function handleSubmitReply() {
  const trimmed = replyText.value.trim();
  if (!trimmed) return;
  addReply(props.comment.id, trimmed);
  replyText.value = "";
  showReplyInput.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Highlight reference badge -->
    <button
      v-if="comment.highlight"
      type="button"
      class="flex items-center gap-1.5 text-xs text-primary bg-primary/5 border border-primary/20 rounded-md px-2 py-1 w-fit hover:bg-primary/10 transition-colors"
      @click="scrollToHighlight(comment.id)"
    >
      <span class="font-medium">Page {{ comment.highlight.pageNumber }}</span>
      <span class="text-muted-foreground truncate max-w-[180px]">
        &ldquo;{{ comment.highlight.text.slice(0, 40) }}{{ comment.highlight.text.length > 40 ? "..." : "" }}&rdquo;
      </span>
    </button>

    <SingleComment :comment="comment" :root-id="comment.id" is-root />

    <!-- Reply button / input -->
    <div class="ml-11">
      <BaseButton
        v-if="!showReplyInput"
        variant="ghost"
        size="sm"
        class="text-muted-foreground h-7 text-xs"
        @click="showReplyInput = true"
      >
        Reply
      </BaseButton>
      <div v-else class="flex flex-col gap-2">
        <MentionInput
          v-model="replyText"
          placeholder="Write a reply..."
          :rows="2"
          :autofocus="true"
          class="text-sm"
          @submit="handleSubmitReply"
        />
        <div class="flex gap-2">
          <BaseButton size="sm" class="gap-1" @click="handleSubmitReply">
            <Send class="size-3" /> Reply
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="showReplyInput = false; replyText = ''">
            Cancel
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Replies with tree connector lines -->
    <div v-if="comment.replies.length > 0" class="relative mt-2">
      <div
        v-for="(reply, index) in comment.replies"
        :key="reply.id"
        class="relative pl-11 pt-3 first:pt-0"
      >
        <div
          class="absolute border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg"
          :style="{
            left: '10px',
            top: index === 0 ? '-90px' : '0px',
            width: '26px',
            height: index === 0 ? '110px' : '20px',
          }"
          aria-hidden="true"
        />
        <div
          v-if="index !== comment.replies.length - 1"
          class="absolute bg-gray-300 dark:bg-gray-600"
          :style="{ left: '10px', top: '20px', bottom: 0, width: '2px' }"
          aria-hidden="true"
        />
        <SingleComment :comment="reply" :root-id="comment.id" is-reply />
      </div>
    </div>
  </div>
</template>
