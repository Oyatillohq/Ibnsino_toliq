<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import CertificateGrid from './components/CertificateGrid.vue'
import Footer from './components/Footer.vue'
import { useTheme } from './composables/useTheme'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <Hero />
      <CertificateGrid />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
