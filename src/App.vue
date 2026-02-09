<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const initAnimations = () => {
    console.log("Initializing animations...");
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible')
            }
        })
    }, observerOptions)

    const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')
    console.log(`Found ${elements.length} elements to animate.`);
    
    elements.forEach(el => {
        observer.observe(el)
    })

    // Safety fallback: reveal all elements after 3 seconds if JS observer fails or is delayed
    setTimeout(() => {
        elements.forEach(el => el.classList.add('reveal-visible'))
    }, 3000)
}

onMounted(() => {
    console.log("App mounted on route:", route.path);
    setTimeout(initAnimations, 500)
})

watch(() => route.path, (newPath) => {
    console.log("Route changed to:", newPath);
    setTimeout(initAnimations, 300)
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
