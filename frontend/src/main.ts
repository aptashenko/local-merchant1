import { createApp } from 'vue'
import './style.css'
import router from './router'
import { pinia } from './store'
import App from './App.vue';
import { useAuthStore } from './store/auth.ts';
import { useAuth } from './composables/useAuth.ts';
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

const authStore = useAuthStore()
const { getProfile } = useAuth();
if (authStore.token) {
  getProfile();
}
