<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Eye, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { galleryService } from '../api/galleryService'

const galleryItems = ref([])
const loading = ref(true)
const errorMessage = ref('')
const selectedImageIndex = ref(null)
const isModalOpen = ref(false)

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

const openModal = (index) => {
  selectedImageIndex.value = index
  isModalOpen.value = true
  // Force browser to not scroll background
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    selectedImageIndex.value = null
  }, 300)
}

const nextImage = () => {
  if (selectedImageIndex.value === null) return;
  if (selectedImageIndex.value < galleryItems.value.length - 1) {
    selectedImageIndex.value++;
  } else {
    selectedImageIndex.value = 0; // Loop back to start
  }
}

const prevImage = () => {
  if (selectedImageIndex.value === null) return;
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--;
  } else {
    selectedImageIndex.value = galleryItems.value.length - 1; // Loop to end
  }
}

const handleKeydown = (e) => {
  if (!isModalOpen.value) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  fetchGallery()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
          :style="{ transitionDelay: (index % 3 * 100) + 'ms' }" @click="openModal(index)">
          <img :src="item.image_url" :alt="item.description || 'Academy Atmosphere'" class="gallery-image"
            loading="lazy" decoding="async">
          <div class="gallery-overlay">
            <Eye :size="32" color="white" />
            <p v-if="item.description" class="img-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div class="modal" :class="{ active: isModalOpen }" @click.self="closeModal">
      <button class="modal-close" @click="closeModal" aria-label="Close">
        <X :size="24" />
      </button>

      <button v-if="galleryItems.length > 1" class="nav-btn prev" @click.stop="prevImage" aria-label="Previous">
        <ChevronLeft :size="32" />
      </button>

      <div class="modal-content" v-if="selectedImageIndex !== null && galleryItems[selectedImageIndex]">
        <div class="modal-image-wrapper">
          <img :src="galleryItems[selectedImageIndex].image_url" :alt="galleryItems[selectedImageIndex].description"
            class="full-cert-img">
        </div>
        <div class="modal-info" v-if="galleryItems[selectedImageIndex].description">
          <p>{{ galleryItems[selectedImageIndex].description }}</p>
        </div>
      </div>

      <button v-if="galleryItems.length > 1" class="nav-btn next" @click.stop="nextImage" aria-label="Next">
        <ChevronRight :size="32" />
      </button>
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
