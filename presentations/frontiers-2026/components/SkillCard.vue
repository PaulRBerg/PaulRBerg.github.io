<script setup lang="ts">
defineProps<{
  name: string
  description: string
  icon?: string // unocss icon class, e.g. 'i-carbon-branch'
}>()
</script>

<template>
  <div class="skill-card">
    <div class="icon">
      <div v-if="icon" :class="icon" />
      <div v-else class="i-carbon-chip" />
    </div>
    <div>
      <h3>{{ name }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
