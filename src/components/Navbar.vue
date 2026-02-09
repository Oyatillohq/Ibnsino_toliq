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
        <router-link to="/" class="nav-link">Bosh sahifa</router-link>
        <router-link to="/#results" class="nav-link">Natijalar</router-link>
        <router-link to="/#subjects" class="nav-link">Fanlar</router-link>
        <router-link to="/certificates" class="nav-link">Sertifikatlar</router-link>
        <router-link to="/#about" class="nav-link">Biz haqimizda</router-link>
        <router-link to="/#contact" class="nav-link">Aloqa</router-link>
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
     <router-link to="/" class="mobile-nav-item" @click="isMenuOpen = false">Bosh sahifa</router-link>
     <router-link to="/#results" class="mobile-nav-item" @click="isMenuOpen = false">Natijalar</router-link>
     <router-link to="/#subjects" class="mobile-nav-item" @click="isMenuOpen = false">Fanlar</router-link>
     <router-link to="/certificates" class="mobile-nav-item" @click="isMenuOpen = false">Sertifikatlar</router-link>
     <router-link to="/#about" class="mobile-nav-item" @click="isMenuOpen = false">Biz haqimizda</router-link>
     <router-link to="/#contact" class="mobile-nav-item" @click="isMenuOpen = false">Aloqa</router-link>
     <a href="/admin/" class="mobile-nav-item" @click="isMenuOpen = false">Admin</a>
  </div>
</template>

<style scoped>
/* Scopes specific navbar styles if needed, else they come from assets/style.css */
</style>
