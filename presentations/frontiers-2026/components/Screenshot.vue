<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  ratio?: string // e.g. "16/9", "4/3"
}>()
</script>

<template>
  <div class="screenshot" :style="{ aspectRatio: ratio ?? '16/9' }">
    <div class="i-carbon-image text-3xl opacity-40" />
    <div class="screenshot-label">[SCREENSHOT]&nbsp; {{ label }}</div>
    <div class="screenshot-sub" v-if="hint">{{ hint }}</div>
  </div>
</template>
