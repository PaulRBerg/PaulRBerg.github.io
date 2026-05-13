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
        <div class="eyebrow cover-eyebrow">Conjecture Con Europe · May 2026</div>
        <h1 class="cover-title" v-html="title" />
        <p class="cover-sub" v-if="sub">{{ sub }}</p>
        <div class="cover-marks">
          <span class="pill">🧬 memetics</span>
          <span class="pill">🧠 critical rationalism</span>
          <span class="pill">⚛️ everett</span>
          <span class="pill">🏛 enlightenment</span>
        </div>
      </div>
      <div class="cover-right">
        <div class="cover-emblem" aria-hidden="true">
          <svg viewBox="0 0 360 360" width="100%" height="100%">
            <defs>
              <radialGradient id="emblem-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff7c2" stop-opacity="0.9"/>
                <stop offset="60%" stop-color="#fcd34d" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#fcd34d" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="180" cy="180" r="170" fill="url(#emblem-glow)"/>
            <g stroke="#0c0c1c" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.92">
              <!-- recursive tree -->
              <path d="M 180 320 L 180 200"/>
              <path d="M 180 240 L 120 190"/>
              <path d="M 180 240 L 240 190"/>
              <path d="M 180 200 L 140 150"/>
              <path d="M 180 200 L 220 150"/>
              <path d="M 120 190 L 90 150"/>
              <path d="M 120 190 L 130 145"/>
              <path d="M 240 190 L 270 150"/>
              <path d="M 240 190 L 230 145"/>
              <path d="M 140 150 L 120 110"/>
              <path d="M 140 150 L 150 105"/>
              <path d="M 220 150 L 240 110"/>
              <path d="M 220 150 L 210 105"/>
              <path d="M 90 150 L 75 115"/>
              <path d="M 270 150 L 285 115"/>
            </g>
            <g fill="#5b21b6">
              <circle cx="120" cy="110" r="5"/>
              <circle cx="150" cy="105" r="5"/>
              <circle cx="210" cy="105" r="5"/>
              <circle cx="240" cy="110" r="5"/>
              <circle cx="130" cy="145" r="4"/>
              <circle cx="230" cy="145" r="4"/>
              <circle cx="75" cy="115" r="4"/>
              <circle cx="285" cy="115" r="4"/>
            </g>
            <g fill="#d97706">
              <circle cx="180" cy="200" r="6"/>
            </g>
            <!-- infinity loop wrapping -->
            <path d="M 60 290 C 90 250 150 320 180 290 C 210 260 270 330 300 290" fill="none" stroke="#5b21b6" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="cover-footer">
      <div><strong>{{ author }}</strong> · co-founder @ Sablier</div>
      <div>{{ event }} · {{ date }}</div>
    </div>
  </div>
</template>
