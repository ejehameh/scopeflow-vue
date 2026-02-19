<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";
import PdfReviewSkeleton from "./PdfReviewSkeleton.vue";
import PdfAnnotationLayer from "./PdfAnnotationLayer.vue";
import { useComments } from "@/composables/useComments";

const PDF_URL = "/scope-of-work.pdf";

const { setNumPages, closePopup } = useComments();

const numPages = ref(0);
const currentPage = ref(1);
const containerWidth = ref(680);
const scrollContainerRef = ref(null);
const loading = ref(true);
const error = ref(false);

let isScrolling = false;
let scrollTimer = null;

function handleRendered(args) {
  if (!args?.source?.numPages) return;
  const n = args.source.numPages;
  numPages.value = n;
  setNumPages(n);
  loading.value = false;
  nextTick(observePages);
}

function handleLoadError() {
  error.value = true;
  loading.value = false;
}

function scrollToPage(pageNumber) {
  isScrolling = true;
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { isScrolling = false; }, 800);
  currentPage.value = pageNumber;
  const el = document.getElementById(`pdf-page-${pageNumber}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

let resizeObserver = null;
let intersectionObserver = null;

function observePages() {
  const container = scrollContainerRef.value;
  if (!container || numPages.value === 0) return;

  if (intersectionObserver) intersectionObserver.disconnect();

  const pageEls = container.querySelectorAll("[data-pdf-page]");
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return;
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const n = entry.target.getAttribute("data-pdf-page");
        if (n && entry.intersectionRatio > (best?.ratio ?? 0)) {
          best = { page: parseInt(n, 10), ratio: entry.intersectionRatio };
        }
      }
      if (best) currentPage.value = best.page;
    },
    { root: container, rootMargin: "-15% 0px -50% 0px", threshold: [0, 0.1, 0.5, 1] }
  );
  pageEls.forEach((el) => intersectionObserver.observe(el));
}

onMounted(() => {
  const container = scrollContainerRef.value;
  if (!container) return;
  resizeObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width;
    if (w != null) containerWidth.value = Math.min(680, Math.max(400, w - 32));
  });
  resizeObserver.observe(container);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  if (scrollTimer) clearTimeout(scrollTimer);
});

const pages = (n) => Array.from({ length: n }, (_, i) => i + 1);
</script>

<template>
  <div class="flex flex-1 min-h-0">
    <PdfReviewSkeleton v-if="loading && !error" />

    <div v-if="error" class="flex h-64 items-center justify-center text-destructive w-full">
      Failed to load PDF.
    </div>

    <template v-if="!error">
      <!-- Thumbnails sidebar -->
      <aside v-show="!loading" class="w-48 shrink-0 flex flex-col gap-2 overflow-y-auto py-2 pr-2">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-2">
          Pages
        </h2>
        <button
          v-for="pageNumber in pages(numPages)"
          :key="'thumb-' + pageNumber"
          type="button"
          :class="[
            'w-full rounded-md border-2 overflow-hidden transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            currentPage === pageNumber
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border border hover:border-muted-foreground/20 hover:bg-muted/50',
          ]"
          :aria-label="'Go to page ' + pageNumber"
          :aria-current="currentPage === pageNumber ? 'true' : undefined"
          @click="scrollToPage(pageNumber)"
        >
          <VuePdfEmbed
            :source="PDF_URL"
            :page="pageNumber"
            :width="120"
            class="w-full max-w-full flex items-center justify-center pointer-events-none"
          />
          <span class="block px-2 py-1 text-xs font-medium text-muted-foreground">
            Page {{ pageNumber }}
          </span>
        </button>
      </aside>

      <!-- Main scrollable PDF pages -->
      <div
        v-show="!loading"
        ref="scrollContainerRef"
        class="flex-1 min-w-0 overflow-y-auto pr-10 overflow-x-hidden bg-muted/30 rounded-lg"
        @click="closePopup()"
      >
        <div
          v-for="pageNumber in pages(numPages)"
          :key="'page-' + pageNumber"
          :id="'pdf-page-' + pageNumber"
          :data-pdf-page="pageNumber"
          class="relative flex justify-center px-4 py-4 border-b border-border last:border-b-0"
        >
          <div class="relative">
            <VuePdfEmbed
              :source="PDF_URL"
              :page="pageNumber"
              :width="containerWidth"
              text-layer
              annotation-layer
              class="shadow-sm bg-white"
              @rendered="handleRendered"
              @rendering-failed="handleLoadError"
            />
            <PdfAnnotationLayer :page-number="pageNumber" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.vue-pdf-embed > div {
  margin-bottom: 0 !important;
}
</style>
