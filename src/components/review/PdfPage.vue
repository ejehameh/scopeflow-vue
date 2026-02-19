<script setup>
import { ref, onMounted, watch } from "vue";
import { usePdf } from "@/composables/usePdf";

const props = defineProps({
  pageNumber: { type: Number, required: true },
  width: { type: Number, required: true },
  source: { type: String, required: true },
  textLayer: { type: Boolean, default: false },
});

const emit = defineEmits(["rendered"]);

const { pdfDoc, renderPage, renderTextLayer } = usePdf(props.source);
const canvasRef = ref(null);
const textLayerRef = ref(null);
const pageHeight = ref(0);

async function render() {
  if (!pdfDoc.value || !canvasRef.value || props.width <= 0) return;
  const dims = await renderPage(props.pageNumber, canvasRef.value, props.width);
  if (dims) {
    pageHeight.value = dims.height;
    emit("rendered");
  }
  if (props.textLayer && textLayerRef.value) {
    await renderTextLayer(props.pageNumber, textLayerRef.value, props.width);
  }
}

onMounted(() => {
  if (pdfDoc.value) {
    render();
  }
});

watch(() => pdfDoc.value, (doc) => {
  if (doc) render();
});

watch(() => props.width, () => {
  if (pdfDoc.value) render();
});
</script>

<template>
  <div class="relative" :style="{ width: width + 'px' }">
    <canvas ref="canvasRef" class="block" />
    <div
      v-if="textLayer"
      ref="textLayerRef"
      class="textLayer"
    />
    <slot />
  </div>
</template>

<style>
.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.25;
  line-height: 1;
  z-index: 5;
}

.textLayer span,
.textLayer br {
  color: transparent;
  position: absolute;
  white-space: pre;
  transform-origin: 0% 0%;
}

.textLayer ::selection {
  background: oklch(0.51 0.23 277 / 40%);
}
</style>
