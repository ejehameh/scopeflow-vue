import { createRouter, createWebHistory } from "vue-router";
import ScopeLanding from "@/pages/ScopeLanding.vue";

const routes = [
  { path: "/", name: "home", component: ScopeLanding },
  { path: "/review", name: "review", component: () => import("@/pages/ReviewPage.vue") },
  { path: "/approved", name: "approved", component: () => import("@/pages/ApprovedPage.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
