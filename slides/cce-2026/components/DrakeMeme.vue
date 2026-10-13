<script setup lang="ts">
defineProps<{
  reject: string
  rejectSub?: string
  approve: string
  approveSub?: string
  rejectEmoji?: string
  approveEmoji?: string
}>()
</script>

<template>
  <div class="drake-grid">
    <div class="drake-row drake-reject">
      <div class="drake-face">
        <div class="drake-portrait drake-portrait-no" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <rect width="200" height="200" rx="14" fill="#fdecec"/>
            <g transform="translate(100 110)">
              <ellipse cx="0" cy="0" rx="62" ry="78" fill="#e7c39b"/>
              <path d="M -62 -10 Q -68 -70 0 -82 Q 68 -70 62 -10 Z" fill="#3d3322"/>
              <ellipse cx="-22" cy="6" rx="4" ry="5" fill="#0c0c1c"/>
              <ellipse cx="22" cy="6" rx="4" ry="5" fill="#0c0c1c"/>
              <!-- frown -->
              <path d="M -22 40 Q 0 26 22 40" fill="none" stroke="#0c0c1c" stroke-width="2.5" stroke-linecap="round"/>
              <!-- hand blocking -->
              <path d="M -85 20 Q -110 -10 -78 -30 L -54 -8 Z" fill="#e7c39b" stroke="#0c0c1c" stroke-width="1.5"/>
            </g>
            <text x="14" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="11" fill="#dc2626" letter-spacing="0.16em">NOPE</text>
          </svg>
        </div>
      </div>
      <div class="drake-text">
        <div class="drake-emoji" v-if="rejectEmoji">{{ rejectEmoji }}</div>
        <div class="drake-headline">{{ reject }}</div>
        <div class="drake-sub" v-if="rejectSub">{{ rejectSub }}</div>
      </div>
    </div>
    <div class="drake-row drake-approve">
      <div class="drake-face">
        <div class="drake-portrait drake-portrait-yes" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <rect width="200" height="200" rx="14" fill="#ecfdf5"/>
            <g transform="translate(100 110)">
              <ellipse cx="0" cy="0" rx="62" ry="78" fill="#e7c39b"/>
              <path d="M -62 -10 Q -68 -70 0 -82 Q 68 -70 62 -10 Z" fill="#3d3322"/>
              <ellipse cx="-22" cy="6" rx="4" ry="5" fill="#0c0c1c"/>
              <ellipse cx="22" cy="6" rx="4" ry="5" fill="#0c0c1c"/>
              <!-- smile -->
              <path d="M -22 30 Q 0 50 22 30" fill="none" stroke="#0c0c1c" stroke-width="2.5" stroke-linecap="round"/>
              <!-- pointing finger -->
              <path d="M 78 6 L 102 -6 L 102 16 Z" fill="#e7c39b" stroke="#0c0c1c" stroke-width="1.5"/>
            </g>
            <text x="14" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="11" fill="#059669" letter-spacing="0.16em">YES</text>
          </svg>
        </div>
      </div>
      <div class="drake-text">
        <div class="drake-emoji" v-if="approveEmoji">{{ approveEmoji }}</div>
        <div class="drake-headline">{{ approve }}</div>
        <div class="drake-sub" v-if="approveSub">{{ approveSub }}</div>
      </div>
    </div>
  </div>
</template>
