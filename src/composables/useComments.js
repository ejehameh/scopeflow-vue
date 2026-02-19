import { ref, watch, readonly } from "vue";
import { ALEX, SARAH, SEED_COMMENTS } from "@/data/discussion";

const STORAGE_KEY = "scopeflow-comments";

function loadComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore corrupt data */ }
  return structuredClone(SEED_COMMENTS);
}

const comments = ref(loadComments());
const activePopupId = ref(null);
const numPages = ref(0);

watch(comments, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  } catch { /* storage full or unavailable */ }
}, { deep: true });

export function useComments() {
  function setNumPages(n) {
    numPages.value = n;
  }

  function openPopup(id) {
    activePopupId.value = id;
  }

  function closePopup() {
    activePopupId.value = null;
  }

  function addComment(body, highlight) {
    const c = {
      id: String(Date.now()),
      author: ALEX,
      body,
      timeAgo: "Just now",
      highlight: highlight || undefined,
      reactions: [],
      resolved: false,
      source: highlight ? "annotation" : "standalone",
      replies: [],
    };
    comments.value = [...comments.value, c];
    if (highlight) activePopupId.value = c.id;
  }

  function addReply(commentId, body) {
    const reply = {
      id: `${commentId}-${Date.now()}`,
      author: SARAH,
      body,
      timeAgo: "Just now",
      reactions: [],
      resolved: false,
      source: "annotation",
      replies: [],
    };
    comments.value = comments.value.map((c) =>
      c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
    );
  }

  function editComment(commentId, replyId, newBody) {
    comments.value = comments.value.map((c) => {
      if (c.id !== commentId) return c;
      if (!replyId) return { ...c, body: newBody };
      return {
        ...c,
        replies: c.replies.map((r) =>
          r.id === replyId ? { ...r, body: newBody } : r
        ),
      };
    });
  }

  function deleteThread(commentId) {
    comments.value = comments.value.filter((c) => c.id !== commentId);
    if (activePopupId.value === commentId) activePopupId.value = null;
  }

  function toggleResolved(commentId) {
    comments.value = comments.value.map((c) =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
  }

  function addReaction(commentId, replyId, emoji) {
    const authorName = ALEX.name;
    comments.value = comments.value.map((c) => {
      if (c.id !== commentId) return c;
      const update = (reactions) => {
        const existingSame = reactions.find(
          (r) => r.emoji === emoji && r.authorName === authorName
        );
        if (existingSame) return reactions.filter((r) => r !== existingSame);
        const withoutPrev = reactions.filter((r) => r.authorName !== authorName);
        return [...withoutPrev, { emoji, authorName }];
      };
      if (!replyId) return { ...c, reactions: update(c.reactions) };
      return {
        ...c,
        replies: c.replies.map((r) =>
          r.id === replyId ? { ...r, reactions: update(r.reactions) } : r
        ),
      };
    });
  }

  function scrollToHighlight(commentId) {
    const comment = comments.value.find((c) => c.id === commentId);
    if (!comment?.highlight) return;
    const pageEl = document.getElementById(
      `pdf-page-${comment.highlight.pageNumber}`
    );
    pageEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    activePopupId.value = commentId;
  }

  function scrollToPage(pageNumber) {
    const pageEl = document.getElementById(`pdf-page-${pageNumber}`);
    pageEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return {
    comments: readonly(comments),
    activePopupId: readonly(activePopupId),
    numPages: readonly(numPages),
    setNumPages,
    openPopup,
    closePopup,
    addComment,
    addReply,
    editComment,
    deleteThread,
    toggleResolved,
    addReaction,
    scrollToHighlight,
    scrollToPage,
  };
}
