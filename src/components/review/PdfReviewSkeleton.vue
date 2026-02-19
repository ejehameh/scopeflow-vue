<template>
  <div class="flex flex-1 min-h-0 gap-4 animate-pulse">
    <aside class="w-48 shrink-0 flex flex-col gap-2 overflow-hidden py-2 pr-2">
      <div class="h-3.5 w-14 rounded bg-muted px-2" />
      <div v-for="i in 4" :key="i" class="flex flex-col gap-1.5">
        <div class="w-full rounded-md bg-muted overflow-hidden" style="aspect-ratio: 120/155" />
        <div class="h-3 w-10 rounded bg-muted/80 mx-1" />
      </div>
    </aside>
    <div class="flex-1 min-w-0 overflow-hidden bg-muted/30 rounded-lg flex items-center justify-center p-4">
      <div
        class="w-full max-w-[680px] rounded-lg bg-muted shadow-sm"
        style="aspect-ratio: 1/1.41; min-height: 400px"
      />
    </div>
  </div>
</template>
