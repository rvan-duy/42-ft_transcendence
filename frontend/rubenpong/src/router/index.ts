import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
	{
		path: "/chat",
		name: "chat",
		component: () => import("../views/ChatView.vue"),
	},
	{
		path: "/chatroom",
		name: "chatroom",
		component: () => import("../views/ChatRoomView.vue"),
	},
    {
      path: "/canvas", //waarom staat deze meuk nou weer hier he Oswin >:(
      name: "canvas",
      component: () => import("../views/CanvasView.vue"),
    },
  ],
});

export default router;
