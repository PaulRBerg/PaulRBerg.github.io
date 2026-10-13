<script setup lang="ts">
defineProps<{
  label: string
  title: string
  emoji?: string
  tone?: 'good' | 'bad' | 'neutral'
}>()
</script>

<template>
  <div class="concept" :class="`concept-${tone ?? 'neutral'}`">
    <div class="concept-head">
      <span class="concept-emoji" v-if="emoji">{{ emoji }}</span>
      <span class="concept-label">{{ label }}</span>
    </div>
    <h3 class="concept-title">{{ title }}</h3>
    <div class="concept-body">
      <slot />
    </div>
  </div>
</template>
