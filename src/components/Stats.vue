<script setup>
import { ref, onMounted } from 'vue'

const stats = [
  { label: 'O\'quvchilar', value: 1500, suffix: '+' },
  { label: 'Oliy o\'quv yurtlariga kirganlar', value: 300, suffix: '+' },
  { label: 'Yillik Tajriba', value: 20, suffix: '+' },
  { label: 'Muvaffaqiyat ko\'rsatkichi', value: 95, suffix: '%' }
]

const animatedStats = ref(stats.map(s => ({ ...s, currentValue: 0 })))

onMounted(() => {
  animatedStats.value.forEach((stat, index) => {
    const duration = 2000
    const frames = 60
    const increment = stat.value / frames
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.value) {
        animatedStats.value[index].currentValue = stat.value
        clearInterval(timer)
      } else {
        animatedStats.value[index].currentValue = Math.floor(current)
      }
    }, duration / frames)
  })
})
</script>

<template>
  <section id="results" class="section-padding bg-light reveal">
    <div class="container">
      <div class="section-header reveal reveal-up">
        <h2 class="section-title">Bizning Natijalarimiz</h2>
        <p class="section-desc">Akademiyamizning muvaffaqiyati o'quvchilarimizning natijalarida namoyon bo'ladi.</p>
      </div>
      <div class="results-grid">
        <div v-for="(stat, index) in animatedStats" :key="stat.label" 
           class="stat-item reveal reveal-up"
           :style="{ marginTop: index > 0 ? '0' : '0' }">
          <span class="stat-val">{{ stat.currentValue }}{{ stat.suffix }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
```
