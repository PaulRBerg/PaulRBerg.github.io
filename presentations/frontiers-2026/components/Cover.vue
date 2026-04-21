<script setup lang="ts">
defineProps<{
  title: string
  sub?: string
  author: string
  event: string
  date: string
}>()
</script>

<template>
  <div class="cover-root">
    <div class="cover-grid">
      <div class="cover-left">
        <div class="eyebrow cover-eyebrow">Frontiers · 2026 · V7 Startup Studio Iasi</div>
        <h1 class="cover-title" v-html="title" />
        <p class="cover-sub" v-if="sub">{{ sub }}</p>
      </div>
      <div class="cover-right">
        <div class="cover-terminal">
          <div class="cover-terminal-head">
            <span class="dot r" />
            <span class="dot y" />
            <span class="dot g" />
            <span class="cover-terminal-title">~ claude code</span>
          </div>
          <div class="cover-terminal-body">
            <div><span class="prompt">&gt;</span> /commit --all</div>
            <div><span class="prompt">&gt;</span> /code-polish</div>
            <div><span class="prompt">&gt;</span> /oracle-codex</div>
            <div><span class="prompt">&gt;</span> /bump-release <span class="dim">--beta</span></div>
            <div><span class="prompt">&gt;</span> /yeet</div>
            <div><span class="prompt">&gt;</span> /tailwind-css</div>
            <div><span class="prompt">&gt;</span> /effect-ts</div>
            <div><span class="prompt">&gt;</span> /autoresearch</div>
            <div class="cursor"><span class="prompt">&gt;</span> <span class="caret">▊</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cover-footer">
      <div><strong>{{ author }}</strong></div>
      <div>{{ event }} · {{ date }}</div>
    </div>
  </div>
</template>
