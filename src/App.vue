<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const initAnimations = () => {
  // 1. First, find all revealable elements
  const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')

  if (elements.length === 0) {
    // If no elements found yet, try again in a bit (DOM might not be ready)
    setTimeout(initAnimations, 200)
    return
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
      }
    })
  }, observerOptions)

  elements.forEach(el => {
    // If element is already in or above viewport, reveal it immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      el.classList.add('reveal-visible')
    }
    observer.observe(el)
  })

  // Safety fallback: reveal all elements after 1.5s anyway to ensure user sees content
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => el.classList.add('reveal-visible'))
  }, 1500)
}

onMounted(() => {
  nextTick(() => {
    setTimeout(initAnimations, 100)
  })
})

watch(() => route.path, () => {
  // Wait for route transition to finish
  setTimeout(() => {
    nextTick(() => {
      initAnimations()
    })
  }, 500)
})
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles are in assets/style.css */
.app-wrapper {
  min-height: 100vh;
  background-color: var(--color-dark);
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
