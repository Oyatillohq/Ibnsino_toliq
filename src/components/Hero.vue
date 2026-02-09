<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const heroParticles = ref([])

const generateParticles = () => {
    const count = window.innerWidth < 768 ? 20 : 40
    const particles = []
    for (let i = 0; i < count; i++) {
        particles.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10,
            opacity: Math.random() * 0.15 + 0.05
        })
    }
    heroParticles.value = particles
}

onMounted(() => {
    generateParticles()
    window.addEventListener('resize', generateParticles)
})

onUnmounted(() => {
    window.removeEventListener('resize', generateParticles)
})

const contactData = {
    telegram: 'https://t.me/Ibn_Sino_Education',
    phones: ['+998 94 444 33 66']
}
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero-dna">
        <div v-for="p in heroParticles" :key="p.id" class="dna-particle" :style="{
                left: p.x + '%',
                top: p.y + '%',
                width: p.size + 'px',
                height: p.size + 'px',
                opacity: p.opacity,
                animationDelay: p.delay + 's',
                animationDuration: p.duration + 's'
            }">
        </div>
    </div>
    
    <div class="container">
      <div class="hero-content reveal reveal-up">
        <span class="hero-badge">Professional Akademiya</span>
        <h1 class="hero-title">IBN SINO EDUCATION</h1>
        <p class="hero-subtitle">
            Universitetga kirish uchun Kimyo va Biologiya fanlaridan chuqurlashtirilgan o'quv akademiyasi.
        </p>
        <div class="hero-btns">
          <a href="#contact" class="btn btn-primary">Hoziroq bog'laning</a>
          <a :href="contactData.telegram" class="btn btn-accent" target="_blank">Telegram</a>
          <a :href="'tel:' + contactData.phones[0].replace(/\s/g, '')" class="btn btn-primary">Qo'ng'iroq qilish</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scroll Animation logic is handled by global CSS, but particles are scoped here */
</style>
