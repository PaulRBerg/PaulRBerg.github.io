<script setup lang="ts">
defineProps<{
  src: string
  alt: string
  caption?: string
  ratio?: string
}>()
</script>

<template>
  <figure class="ghibli-frame" :style="ratio ? { aspectRatio: ratio } : undefined">
    <img :src="src" :alt="alt" loading="lazy" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
