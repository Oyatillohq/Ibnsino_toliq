<script setup>
import { Eye } from 'lucide-vue-next'

defineProps({
  group: Object
})
</script>

<template>
  <div 
    class="certificate-card" 
    @click="$emit('select', group)"
    role="button"
    tabindex="0"
    :aria-label="group.student_name + ' sertifikatlarini ko\'rish'"
    @keydown.enter="$emit('select', group)"
  >
    <div class="cert-img-container">
      <img 
        :src="group.certificates[0].image_url" 
        :alt="group.student_name + ' natijalari'" 
        class="certificate-image"
        loading="lazy"
      >
      <div class="cert-overlay">
        <Eye :size="32" color="var(--color-accent)" aria-hidden="true" />
        <span>Ko'rish</span>
      </div>
    </div>
    <div class="cert-info">
      <div class="cert-header">
        <span class="cert-level">{{ group.max_level }}</span>
      </div>
      <h3 class="student-name">{{ group.student_name }}</h3>
      <div class="cert-footer">
        <span>{{ group.certificates.length }} ta sertifikat</span>
        <span>{{ group.year }}-yil</span>
      </div>
    </div>
  </div>
</template>
