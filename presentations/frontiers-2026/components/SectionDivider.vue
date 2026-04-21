<script setup lang="ts">
defineProps<{
  number: string
  title: string
  eyebrow?: string
  kicker?: string
  total?: string
}>()
</script>

<template>
  <div class="divider">
    <div class="divider-bg" />
    <div class="divider-bignum">{{ number }}</div>

    <div class="divider-header">
      <span>{{ eyebrow ?? "Section" }}</span>
      <span>Part <span class="dot">·</span> {{ number }} / {{ total ?? "04" }}</span>
    </div>

    <div class="divider-body">
      <div class="divider-number">{{ number }}</div>
      <h1 class="divider-title" v-html="title" />
    </div>

    <div class="divider-footer">
      <div class="eyebrow-sub" v-if="kicker">{{ kicker }}</div>
      <div class="eyebrow-sub" v-else>&nbsp;</div>
      <div class="pagemark">Frontiers 2026 · PRB</div>
    </div>
  </div>
</template>
