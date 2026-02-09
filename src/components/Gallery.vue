<script setup>
import { ref } from 'vue'
import { Eye } from 'lucide-vue-next'

const gallery = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
]
</script>

<template>
  <section id="gallery" class="section-padding bg-white">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Bizning Muhit</h2>
        <p class="section-desc">O'quvchilarimiz uchun yaratilgan zamonaviy va qulay sharoitlar bilan tanishing.</p>
      </div>
      <div class="gallery-grid">
        <div v-for="(img, index) in gallery" :key="index" class="gallery-item">
          <img :src="img" alt="Academy Atmosphere" class="gallery-image" loading="lazy">
          <div class="gallery-overlay">
            <Eye :size="32" color="white" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
