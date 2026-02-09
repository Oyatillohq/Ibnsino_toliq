import { ref, onMounted } from 'vue'

export function useTheme() {
    const isDarkMode = ref(true)

    const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value
        const theme = isDarkMode.value ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        isDarkMode.value = savedTheme === 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
    }

    return { isDarkMode, toggleTheme, initTheme }
}
