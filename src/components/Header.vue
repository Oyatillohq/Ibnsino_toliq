<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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

// Helper to check if a link is exactly active (handling home vs hash links)
const isExactlyActive = (path) => {
  if (path === '/') return route.path === '/' && !route.hash
  return route.fullPath === path
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-content">
      <router-link to="/" class="logo-link">
        <div class="logo-text">IBN <span>SINO</span></div>
      </router-link>

      <div class="desktop-menu">
        <router-link to="/" class="nav-link" :class="{ 'exact-active': isExactlyActive('/') }">Bosh sahifa</router-link>
        <router-link to="/results" class="nav-link"
          :class="{ 'exact-active': route.path === '/results' }">Natijalar</router-link>
        <router-link to="/#courses" class="nav-link"
          :class="{ 'exact-active': isExactlyActive('/#courses') }">Fanlar</router-link>
        <router-link to="/certificates" class="nav-link"
          :class="{ 'exact-active': route.path === '/certificates' }">Sertifikatlar</router-link>
        <router-link to="/#about" class="nav-link" :class="{ 'exact-active': isExactlyActive('/#about') }">Biz
          haqimizda</router-link>
        <router-link to="/contact" class="nav-link"
          :class="{ 'exact-active': route.path === '/contact' }">Aloqa</router-link>
        <a href="/admin/" class="nav-link" target="_blank">Admin</a>
      </div>

      <button class="mobile-btn" @click="isMenuOpen = !isMenuOpen" aria-label="Menu">
        <div class="hamburger" :class="{ active: isMenuOpen }">
          <span></span><span></span><span></span>
        </div>
      </button>
    </div>
  </nav>

  <div class="mobile-menu" :class="{ active: isMenuOpen }">
    <router-link to="/" class="mobile-nav-item" @click="isMenuOpen = false">Bosh sahifa</router-link>
    <router-link to="/results" class="mobile-nav-item" @click="isMenuOpen = false">Natijalar</router-link>
    <router-link to="/#courses" class="mobile-nav-item" @click="isMenuOpen = false">Fanlar</router-link>
    <router-link to="/certificates" class="mobile-nav-item" @click="isMenuOpen = false">Sertifikatlar</router-link>
    <router-link to="/#about" class="mobile-nav-item" @click="isMenuOpen = false">Biz haqimizda</router-link>
    <router-link to="/contact" class="mobile-nav-item" @click="isMenuOpen = false">Aloqa</router-link>
    <a href="/admin/" class="mobile-nav-item" @click="isMenuOpen = false">Admin</a>
  </div>
</template>

<style scoped>
/* Individual transition for hamburger to ensure smoothness */
.hamburger span {
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
