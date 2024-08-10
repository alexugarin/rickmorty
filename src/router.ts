import { createRouter, createWebHistory } from 'vue-router';
import Characters from '@/views/CharactersPage.vue';

const props = (route: any) => ({ page: Number(route.query.page) });
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
