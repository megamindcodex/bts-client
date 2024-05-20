import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import ChatRoomPage from "@/views/ChatRoomPage.vue";
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";
import axios from "axios";
import { cw_endpoint } from "@/constant/endpoint";

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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = await userStore.getTokenFromCookies(userStore.cookieName);

  if (to.name === "chatRoom" && (!token || token === "")) {
    // If the user is trying to access the chat room and there's no token, redirect to login
    next({ name: "login" });
  } else {
    // Otherwise, proceed to the requested route
    next();
  }

  // const previous_route = ref(from.params.name)

  if (to.name === "chatRoom") {
    const userName = userStore.userName;
    const condition = true;
    console.log(`Previous route: ${from.name}. condition: ${condition}`);

    if (!token) {
      console.error("token is undefined");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${cw_endpoint}/toggle_hasRead`,
      { receiverName: userName, condition },
      config
    );

    if (res.status === 200) {
      await userStore.getUserData();
    }
  }

  if (from.name === "chatRoom") {
    const userName = userStore.userName;
    const condition = true;
    console.log(`Previous route: ${from.name}. condition: ${condition}`);

    if (!token) {
      console.error("token is undefined");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${cw_endpoint}/toggle_hasRead`,
      { receiverName: userName, condition },
      config
    );

    if (res.status === 200) {
      await userStore.getUserData();
    }
  }
});

export default router;
