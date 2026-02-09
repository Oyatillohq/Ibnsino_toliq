<script setup>
defineProps({
  group: Object
})
</script>

<template>
  <div class="certificate-card" @click="$emit('select', group)">
    <div class="cert-img-container">
      <img :src="group.primary_image" :alt="group.student_name" class="certificate-image">
      <div class="cert-overlay">
        <i data-lucide="eye"></i>
        <span>Ko'rish</span>
      </div>
    </div>
    <div class="cert-info">
      <div class="cert-header">
        <span class="cert-level">{{ group.max_level }}</span>
      </div>
      <h3 class="student-name">{{ group.student_name }}</h3>
      <div class="cert-footer">
        <span>{{ group.total_certs }} ta sertifikat</span>
        <span>{{ group.year }}-yil</span>
      </div>
    </div>
  </div>
</template>
