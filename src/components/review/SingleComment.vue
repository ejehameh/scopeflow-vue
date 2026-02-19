<script setup>
import { ref } from "vue";
import { MoreHorizontal, Pencil, Trash2, CheckCheck, RotateCcw } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CommentBody from "./CommentBody.vue";
import EmojiPicker from "./EmojiPicker.vue";
import MentionInput from "./MentionInput.vue";
import PortalDropdown from "./PortalDropdown.vue";
import { useComments } from "@/composables/useComments";

const props = defineProps({
  comment: { type: Object, required: true },
  rootId: { type: String, required: true },
  isReply: { type: Boolean, default: false },
  isRoot: { type: Boolean, default: false },
});

const { editComment, addReaction, deleteThread, toggleResolved } = useComments();

const isEditing = ref(false);
const editText = ref(props.comment.body);
const showMenu = ref(false);
const menuBtnEl = ref(null);

function saveEdit() {
  editComment(props.rootId, props.isReply ? props.comment.id : null, editText.value.trim());
  isEditing.value = false;
}

function groupReactions(reactions) {
  const map = new Map();
  for (const r of reactions) map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
  return Array.from(map, ([emoji, count]) => ({ emoji, count }));
}
</script>

<template>
  <div :class="['group/comment flex gap-3', isReply && 'items-start']">
    <UserAvatar :letter="comment.author.avatarLetter" />
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium text-foreground">
          {{ comment.author.name }}
          <span v-if="comment.author.role" class="text-muted-foreground font-normal">
            ({{ comment.author.role }})
          </span>
        </p>
        <div class="flex items-center gap-2 ml-auto">
          <div
            v-if="comment.resolved"
            class="text-xs ml-auto bg-green-500/10 px-2 py-0.5 rounded-full text-green-600 font-medium flex items-center gap-1"
          >
            <CheckCheck class="size-3" /> Resolved
          </div>
          <button
            ref="menuBtnEl"
            class="ml-auto opacity-0 group-hover/comment:opacity-100 transition-opacity cursor-pointer hover:bg-muted rounded-md size-6 inline-flex items-center justify-center"
            @click="showMenu = !showMenu"
          >
            <MoreHorizontal class="size-3.5" />
          </button>
        </div>
        <PortalDropdown :open="showMenu" :trigger-ref="menuBtnEl" @close="showMenu = false">
          <button
            type="button"
            class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
            @click="isEditing = true; editText = comment.body; showMenu = false"
          >
            <Pencil class="size-3.5" /> Edit
          </button>
          <template v-if="isRoot">
            <button
              type="button"
              class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
              @click="toggleResolved(rootId); showMenu = false"
            >
              <component :is="comment.resolved ? RotateCcw : CheckCheck" class="size-3.5" />
              {{ comment.resolved ? "Reopen" : "Resolve" }}
            </button>
            <button
              type="button"
              class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
              @click="deleteThread(rootId); showMenu = false"
            >
              <Trash2 class="size-3.5" /> Delete thread
            </button>
          </template>
        </PortalDropdown>
      </div>

      <div v-if="isEditing" class="mt-1.5 space-y-1">
        <MentionInput v-model="editText" :rows="2" class="text-sm" :autofocus="true" @submit="saveEdit" />
        <div class="flex gap-1">
          <BaseButton size="xs" @click="saveEdit">Save</BaseButton>
          <BaseButton size="xs" variant="ghost" @click="isEditing = false">Cancel</BaseButton>
        </div>
      </div>
      <div
        v-else
        class="mt-1.5 rounded-2xl px-4 py-2.5 text-sm text-foreground bg-muted/90 border border-border/80 shadow-sm rounded-tl-md"
      >
        <CommentBody :text="comment.body" />
      </div>

      <!-- Reactions -->
      <div v-if="comment.reactions.length > 0" class="flex gap-1 mt-2 flex-wrap">
        <button
          v-for="{ emoji, count } in groupReactions(comment.reactions)"
          :key="emoji"
          type="button"
          class="text-xs border border-border rounded-full px-1.5 py-0.5 hover:bg-accent"
          @click="addReaction(rootId, isReply ? comment.id : null, emoji)"
        >
          {{ emoji }} {{ count }}
        </button>
      </div>
      <div class="flex items-center gap-1">
        <p class="text-xs text-muted-foreground">{{ comment.timeAgo }}</p>
        <EmojiPicker @select="(emoji) => addReaction(rootId, isReply ? comment.id : null, emoji)" />
      </div>
    </div>
  </div>
</template>
