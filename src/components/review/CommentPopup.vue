<script setup>
import { ref, watch, Teleport } from "vue";
import { X, MoreHorizontal, Pencil, CheckCheck, RotateCcw, Trash2 } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CommentBody from "./CommentBody.vue";
import EmojiPicker from "./EmojiPicker.vue";
import MentionInput from "./MentionInput.vue";
import PortalDropdown from "./PortalDropdown.vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  comment: { type: Object, required: true },
});

const { addReply, editComment, deleteThread, toggleResolved, addReaction, closePopup } = useComments();

const replyText = ref("");
const editingId = ref(null);
const editText = ref("");
const showMenu = ref(false);
const menuBtnEl = ref(null);
const threadRef = ref(null);
const prevReplyCount = ref(props.comment.replies.length);

watch(() => props.comment.replies.length, (len) => {
  if (len > prevReplyCount.value) {
    threadRef.value?.scrollTo({ top: threadRef.value.scrollHeight, behavior: "smooth" });
  }
  prevReplyCount.value = len;
});

function startEdit(id, body) {
  editingId.value = id;
  editText.value = body;
}

function saveEdit() {
  if (!editingId.value) return;
  const isRoot = editingId.value === props.comment.id;
  editComment(props.comment.id, isRoot ? null : editingId.value, editText.value.trim());
  editingId.value = null;
  editText.value = "";
}

function handleReply() {
  const t = replyText.value.trim();
  if (!t) return;
  addReply(props.comment.id, t);
  replyText.value = "";
}

function groupReactions(reactions) {
  const map = new Map();
  for (const r of reactions) map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
  return Array.from(map, ([emoji, count]) => ({ emoji, count }));
}
</script>

<template>
  <div
    class="w-80 rounded-lg border border-border bg-popover shadow-xl"
    :style="{ zIndex: 9999 }"
    @click.stop
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-border">
      <span class="text-sm font-semibold text-foreground">Comment</span>
      <div class="flex items-center gap-0.5">
        <button
          ref="menuBtnEl"
          class="cursor-pointer hover:bg-muted rounded-md size-6 inline-flex items-center justify-center"
          @click="showMenu = !showMenu"
        >
          <MoreHorizontal class="size-4" />
        </button>
        <PortalDropdown :open="showMenu" :trigger-ref="menuBtnEl" @close="showMenu = false">
          <button
            type="button"
            class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
            @click="toggleResolved(comment.id); showMenu = false"
          >
            <component :is="comment.resolved ? RotateCcw : CheckCheck" class="size-3.5" />
            {{ comment.resolved ? "Reopen" : "Mark as resolved" }}
          </button>
          <button
            type="button"
            class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
            @click="deleteThread(comment.id); showMenu = false"
          >
            <Trash2 class="size-3.5" /> Delete thread...
          </button>
        </PortalDropdown>
        <button
          class="cursor-pointer hover:bg-muted rounded-md size-6 inline-flex items-center justify-center"
          @click="closePopup"
        >
          <X class="size-4" />
        </button>
      </div>
    </div>

    <!-- Thread -->
    <div ref="threadRef" class="max-h-64 overflow-y-auto p-3 space-y-3">
      <!-- Root message -->
      <MessageBubble
        :comment="comment"
        :is-editing="editingId === comment.id"
        :edit-text="editText"
        @start-edit="startEdit(comment.id, comment.body)"
        @save-edit="saveEdit"
        @cancel-edit="editingId = null"
        @edit-text-change="editText = $event"
        @react="(emoji) => addReaction(comment.id, null, emoji)"
        :group-reactions="groupReactions"
      />
      <!-- Replies -->
      <MessageBubble
        v-for="r in comment.replies"
        :key="r.id"
        :comment="r"
        :is-editing="editingId === r.id"
        :edit-text="editText"
        @start-edit="startEdit(r.id, r.body)"
        @save-edit="saveEdit"
        @cancel-edit="editingId = null"
        @edit-text-change="editText = $event"
        @react="(emoji) => addReaction(comment.id, r.id, emoji)"
        :group-reactions="groupReactions"
      />
    </div>

    <!-- Reply input -->
    <div class="border-t border-border w-full justify-between p-2 flex items-center gap-2">
      <UserAvatar letter="S" size="sm" />
      <MentionInput
        v-model="replyText"
        placeholder="Reply"
        :rows="1"
        class="text-sm flex-1 w-full min-h-[32px] py-1.5"
        @submit="handleReply"
      />
      <BaseButton
        variant="ghost"
        size="icon-xs"
        class="text-primary shrink-0"
        :disabled="!replyText.trim()"
        @click="handleReply"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
      </BaseButton>
    </div>
  </div>
</template>

<script>
const MessageBubble = {
  name: "MessageBubble",
  components: { UserAvatar, CommentBody, EmojiPicker, MentionInput, PortalDropdown, BaseButton, MoreHorizontal, Pencil },
  props: {
    comment: { type: Object, required: true },
    isEditing: { type: Boolean, default: false },
    editText: { type: String, default: "" },
    groupReactions: { type: Function, required: true },
  },
  emits: ["start-edit", "save-edit", "cancel-edit", "edit-text-change", "react"],
  setup() {
    const showBubbleMenu = ref(false);
    const bubbleMenuBtnEl = ref(null);
    return { showBubbleMenu, bubbleMenuBtnEl };
  },
  template: `
    <div class="group/bubble flex items-start gap-2">
      <UserAvatar :letter="comment.author.avatarLetter" size="sm" class="mt-0.5" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-foreground">{{ comment.author.name }}</span>
          <span class="text-xs text-muted-foreground">{{ comment.timeAgo }}</span>
          <button
            ref="bubbleMenuBtnEl"
            class="ml-auto opacity-0 group-hover/bubble:opacity-100 transition-opacity cursor-pointer hover:bg-muted rounded-md size-6 inline-flex items-center justify-center"
            @click="showBubbleMenu = !showBubbleMenu"
          >
            <MoreHorizontal class="size-3.5" />
          </button>
          <PortalDropdown :open="showBubbleMenu" :trigger-ref="bubbleMenuBtnEl" width="w-28" @close="showBubbleMenu = false">
            <button
              type="button"
              class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
              @click="$emit('start-edit'); showBubbleMenu = false"
            >
              <Pencil class="size-3" /> Edit
            </button>
          </PortalDropdown>
        </div>
        <div v-if="isEditing" class="mt-1 space-y-1">
          <MentionInput :model-value="editText" @update:model-value="$emit('edit-text-change', $event)" :rows="2" class="text-sm" :autofocus="true" @submit="$emit('save-edit')" />
          <div class="flex gap-1">
            <BaseButton size="xs" @click="$emit('save-edit')">Save</BaseButton>
            <BaseButton size="xs" variant="ghost" @click="$emit('cancel-edit')">Cancel</BaseButton>
          </div>
        </div>
        <p v-else class="text-sm text-foreground/90 mt-0.5"><CommentBody :text="comment.body" /></p>
        <div v-if="comment.reactions.length > 0" class="flex gap-1 mt-1 flex-wrap">
          <button
            v-for="{ emoji, count } in groupReactions(comment.reactions)"
            :key="emoji"
            type="button"
            class="text-xs border border-border rounded-full px-1.5 py-0.5 hover:bg-accent"
            @click="$emit('react', emoji)"
          >
            {{ emoji }} {{ count }}
          </button>
        </div>
        <div class="flex items-center gap-1 mt-1">
          <EmojiPicker @select="(emoji) => $emit('react', emoji)" />
        </div>
      </div>
    </div>
  `,
};

export default { components: { MessageBubble } };
</script>
