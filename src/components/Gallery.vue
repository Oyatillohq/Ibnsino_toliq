<script setup>
import { ref, onMounted } from 'vue'
import { Eye, Image as ImageIcon } from 'lucide-vue-next'
import { galleryService } from '../api/galleryService'

const galleryItems = ref([])
const loading = ref(true)
const errorMessage = ref('')

const fetchGallery = async () => {
  loading.value = true
  const { data, error } = await galleryService.getGalleryItems()
  if (error) {
    errorMessage.value = error
  } else {
    galleryItems.value = data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchGallery()
})
</script>

<template>
  <section id="gallery" class="section-padding">
    <div class="container">
      <div class="section-header reveal reveal-left">
        <h2 class="section-title">Bizning Muhit</h2>
        <p class="section-desc">O'quvchilarimiz uchun yaratilgan zamonaviy va qulay sharoitlar bilan tanishing.</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Rasmlar yuklanmoqda...</p>
      </div>

      <div v-else-if="galleryItems.length === 0" class="empty-gallery reveal reveal-up">
        <div class="empty-icon">
          <ImageIcon :size="48" />
        </div>
        <p v-if="errorMessage" class="error-text">Xatolik: {{ errorMessage }}</p>
        <p v-else>Hozircha galereyada rasmlar mavjud emas.</p>
      </div>

      <div v-else class="gallery-grid">
        <div v-for="(item, index) in galleryItems" :key="item.id" class="gallery-item reveal reveal-up"
          :style="{ transitionDelay: (index % 3 * 100) + 'ms' }">
          <img :src="item.image_url" :alt="item.description || 'Academy Atmosphere'" class="gallery-image"
            loading="lazy">
          <div class="gallery-overlay">
            <Eye :size="32" color="white" />
            <p v-if="item.description" class="img-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.loading-state,
.empty-gallery {
  text-align: center;
  padding: 5rem 0;
  color: var(--color-text-light);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.error-text {
  color: #ff8a80;
}

.img-desc {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
}
</style>
