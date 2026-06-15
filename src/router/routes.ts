import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CardsList.vue') },
      { path: 'deck-builder', component: () => import('pages/DeckBuilder.vue') },
      { path: 'url-test', component: () => import('pages/DeckURLTest.vue') },
      { path: 'deck-compare', component: () => import('pages/DeckCompare.vue') },
      { path: 'admin/archetypes', component: () => import('pages/AdminArchetypes.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
