<script setup>
import { ref } from "vue";
import { MoreHorizontal, Pencil } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CommentBody from "./CommentBody.vue";
import EmojiPicker from "./EmojiPicker.vue";
import MentionInput from "./MentionInput.vue";
import PortalDropdown from "./PortalDropdown.vue";

const props = defineProps({
  comment: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  editText: { type: String, default: "" },
  groupReactions: { type: Function, required: true },
});

const emit = defineEmits(["start-edit", "save-edit", "cancel-edit", "edit-text-change", "react"]);

const showBubbleMenu = ref(false);
const bubbleMenuBtnEl = ref(null);
</script>

<template>
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
            @click="emit('start-edit'); showBubbleMenu = false"
          >
            <Pencil class="size-3" /> Edit
          </button>
        </PortalDropdown>
      </div>
      <div v-if="isEditing" class="mt-1 space-y-1">
        <MentionInput
          :model-value="editText"
          @update:model-value="emit('edit-text-change', $event)"
          :rows="2"
          class="text-sm"
          :autofocus="true"
          @submit="emit('save-edit')"
        />
        <div class="flex gap-1">
          <BaseButton size="xs" @click="emit('save-edit')">Save</BaseButton>
          <BaseButton size="xs" variant="ghost" @click="emit('cancel-edit')">Cancel</BaseButton>
        </div>
      </div>
      <p v-else class="text-sm text-foreground/90 mt-0.5">
        <CommentBody :text="comment.body" />
      </p>
      <div v-if="comment.reactions.length > 0" class="flex gap-1 mt-1 flex-wrap">
        <button
          v-for="{ emoji, count } in groupReactions(comment.reactions)"
          :key="emoji"
          type="button"
          class="text-xs border border-border rounded-full px-1.5 py-0.5 hover:bg-accent"
          @click="emit('react', emoji)"
        >
          {{ emoji }} {{ count }}
        </button>
      </div>
      <div class="flex items-center gap-1 mt-1">
        <EmojiPicker @select="(emoji) => emit('react', emoji)" />
      </div>
    </div>
  </div>
</template>
