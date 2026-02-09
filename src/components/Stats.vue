<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const stats = [
  { label: 'O\'quvchilar', subLabel: '7-11 sinflar va bitiruvchilar', value: 1500, suffix: '+' },
  { label: 'Oliy o\'quv yurtlariga kirganlar (har yili)', value: 500, suffix: '+' },
  { label: 'Yillik Tajriba', value: 20, suffix: '+' },
  { label: 'Muvaffaqiyat ko\'rsatkichi', value: 95, suffix: '%' }
]

const animatedStats = ref(stats.map(s => ({ ...s, currentValue: 0 })))
const resultsSection = ref(null)
let hasAnimated = false

const runStatsAnimation = () => {
    if (hasAnimated) return
    hasAnimated = true
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
}

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runStatsAnimation()
            }
        })
    }, { threshold: 0.15 })

    if (resultsSection.value) {
        observer.observe(resultsSection.value)
    }
})
</script>

<template>
  <section id="results" ref="resultsSection" class="section-padding bg-light reveal reveal-left">
    <div class="container">
      <div class="section-header reveal reveal-left">
        <h2 class="section-title">Bizning Natijalarimiz</h2>
        <p class="section-desc">Akademiyamizning muvaffaqiyati o'quvchilarimizning natijalarida namoyon bo'ladi.</p>
      </div>
      <div class="results-grid">
        <div v-for="(stat, index) in animatedStats" :key="stat.label" 
             class="stat-item reveal reveal-left"
             :style="{ transitionDelay: (index * 150) + 'ms' }">
          <span class="stat-val">{{ stat.currentValue }}{{ stat.suffix }}</span>
          <span class="stat-label">{{ stat.label }}</span>
          <span v-if="stat.subLabel" class="stat-sub-label">{{ stat.subLabel }}</span>
        </div>
      </div>

      <div class="stats-action reveal reveal-up" style="transition-delay: 0.6s;">
        <router-link to="/certificates" class="btn btn-primary stats-btn">
          <span>Barcha sertifikatlarni ko'rish</span>
          <ArrowRight :size="20" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-action {
  margin-top: 4rem;
  display: flex;
  justify-content: center;
}

.stats-btn {
  gap: 1rem;
  padding: 1.25rem 3rem;
  font-size: 1.1rem;
}

.stats-btn:hover {
  gap: 1.5rem; /* Small micro-animation on hover */
}

.stat-sub-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-accent);
  margin-top: 0.5rem;
  font-weight: 600;
  opacity: 0.9;
}
</style>
