import { ref, shallowRef } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).href;

const pdfDoc = shallowRef(null);
const numPages = ref(0);
const loading = ref(true);
const error = ref(false);
let loadPromise = null;

export function usePdf(url) {
  if (!loadPromise) {
    loadPromise = pdfjsLib
      .getDocument(url)
      .promise.then((doc) => {
        pdfDoc.value = doc;
        numPages.value = doc.numPages;
        loading.value = false;
      })
      .catch(() => {
        error.value = true;
        loading.value = false;
      });
  }

  async function renderPage(pageNumber, canvas, width) {
    const doc = pdfDoc.value;
    if (!doc) return;
    const page = await doc.getPage(pageNumber);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = width / unscaledViewport.width;
    const viewport = page.getViewport({ scale });

    canvas.width = Math.floor(viewport.width * window.devicePixelRatio);
    canvas.height = Math.floor(viewport.height * window.devicePixelRatio);
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return { width: viewport.width, height: viewport.height };
  }

  async function renderTextLayer(pageNumber, container, width) {
    const doc = pdfDoc.value;
    if (!doc) return;
    const page = await doc.getPage(pageNumber);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = width / unscaledViewport.width;
    const viewport = page.getViewport({ scale });
    const textContent = await page.getTextContent();

    container.innerHTML = "";
    container.style.width = viewport.width + "px";
    container.style.height = viewport.height + "px";

    const { TextLayer } = await import("pdfjs-dist/build/pdf.mjs");
    const textLayer = new TextLayer({
      textContentSource: textContent,
      container,
      viewport,
    });
    await textLayer.render();
  }

  return { pdfDoc, numPages, loading, error, renderPage, renderTextLayer };
}
