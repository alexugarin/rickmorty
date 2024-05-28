import { createRouter, createWebHistory } from "vue-router";
import Characters from '@/views/Characters.vue'

const props = (route) => ({ page: Number(route.query.page) });
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: {
              name: 'Characters',
              query: {
                page: 1
              }
            }
          },
          {
            path: '/character',
            name: 'Characters',
            component: Characters,
            props
          },
    ],
  });
  
  export default router;