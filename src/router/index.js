import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import ChatRoomPage from "@/views/ChatRoomPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/chatRoom",
      name: "chatRoom",
      component: ChatRoomPage,
    },
  ],
});

export default router;
