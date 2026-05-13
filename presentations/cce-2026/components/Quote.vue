<script setup lang="ts">
defineProps<{
  author?: string
  source?: string
}>()
</script>

<template>
  <figure class="quote">
    <blockquote>
      <slot />
    </blockquote>
    <figcaption v-if="author || source">
      <span class="dash">—</span>
      <strong v-if="author">{{ author }}</strong>
      <span v-if="source" class="source">, {{ source }}</span>
    </figcaption>
  </figure>
</template>
