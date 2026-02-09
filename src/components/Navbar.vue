<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-content">
      <a href="/" class="logo-link">
        <div class="logo-text">IBN <span>SINO</span></div>
      </a>

      <div class="desktop-menu">
        <a href="#hero" class="nav-link">Bosh sahifa</a>
        <a href="#results" class="nav-link">Natijalar</a>
        <a href="#subjects" class="nav-link">Fanlar</a>
        <a href="#certificates" class="nav-link">Sertifikatlar</a>
        <a href="#about" class="nav-link">Biz haqimizda</a>
        <a href="#contact" class="nav-link">Aloqa</a>
        <a href="/admin/" class="nav-link" target="_blank">Admin</a>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="mobile-btn" @click="isMenuOpen = !isMenuOpen">
          <div class="hamburger" :class="{ active: isMenuOpen }">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </div>
  </nav>

  <div class="mobile-menu" :class="{ active: isMenuOpen }">
     <a href="#hero" class="mobile-nav-item" @click="isMenuOpen = false">Bosh sahifa</a>
     <a href="#results" class="mobile-nav-item" @click="isMenuOpen = false">Natijalar</a>
     <a href="#subjects" class="mobile-nav-item" @click="isMenuOpen = false">Fanlar</a>
     <a href="#certificates" class="mobile-nav-item" @click="isMenuOpen = false">Sertifikatlar</a>
     <a href="#about" class="mobile-nav-item" @click="isMenuOpen = false">Biz haqimizda</a>
     <a href="#contact" class="mobile-nav-item" @click="isMenuOpen = false">Aloqa</a>
     <a href="/admin/" class="mobile-nav-item" @click="isMenuOpen = false">Admin</a>
  </div>
</template>

<style scoped>
/* Scopes specific navbar styles if needed, else they come from assets/style.css */
</style>
