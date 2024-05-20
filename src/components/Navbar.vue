
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Logo from "@/components/Logo.vue";
import ProfileDP from "@/components/ProfileDP.vue";
import { useUserStore } from "../stores/userStore";
const route = useRoute();
const router = useRouter();
const drawer = ref(false);
const userStore = useUserStore();
const isLoggedIn = ref(null);
const currentRoute = ref(null);

const navRoutes = ref([
  {
    name: "Home",
    url: "home",
  },
  {
    name: "Chat",
    url: "chatRoom",
  },
  {
    name: "Signup",
    url: "signup",
  },
  {
    name: "Login",
    url: "login",
  },
]);

const newMessage = ref(false);
onMounted(async () => {
  const cookieName = "token";
  const token = await userStore.getTokenFromCookies(cookieName);

  watch(
    () => userStore.newMessage,
    (newValue) => {
      newMessage.value = newValue;
      console.log(newMessage.value);
    }
  );
});

const navigateTo = (routeName) => {
  console.log(routeName);
  router.push({ name: routeName });
};

const activeRoute = (routeName) => {
  if (currentRoute.value === routeName) return currentRoute;
};

// Watch for changes in userStore.isLoggedIn and update isLoggedIn accordingly
watch(
  () => userStore.isLoggedIn,
  (newValue) => {
    isLoggedIn.value = newValue;
    // console.log(isLoggedIn.value);
  }
);

watch(
  () => route.name,
  (newRoute) => {
    currentRoute.value = newRoute;
  }
);
</script>

<template>
  <div class="head px-2" v-show="route.path !== '/chatRoom'">
    <RouterLink to="/" class="logo-link"><Logo /></RouterLink>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke="currentColor"
      class="w-2 h-6 menu"
      @click.stop="drawer = !drawer"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
      />
    </svg>
    <v-badge
      v-show="newMessage"
      inline
      color="success text-grey-lighten-3"
      class="msg_badge"
      content="New"
      @click.stop="drawer = !drawer"
    >
    </v-badge>
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      class="nan-cont"
    >
      <ProfileDP />
      <div class="nav pt-2" v-if="navRoutes">
        <span
          :class="{ active: activeRoute(nav.url) }"
          class="nav-item pa-1"
          v-for="nav in navRoutes"
          :key="nav.name"
          @click="navigateTo(nav.url)"
        >
          <span v-if="isLoggedIn">
            <span
              v-show="nav.name !== 'Login' && nav.name !== 'Signup'"
              class="position-relative"
            >
              <v-badge
                v-show="nav.name === 'Chat' && userStore.newMessage"
                inline
                color="success pa-2"
                class="position-absolute ml-10"
                content="New"
              >
              </v-badge>
              {{ nav.name }}</span
            >
          </span>
          <span v-else>
            <span>{{ nav.name }}</span>
          </span>
        </span>
      </div>
    </v-navigation-drawer>
  </div>
</template>
<style scoped>
.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

/* .nan-cont {
  display: flex;
} */
.nav {
  width: 100%;
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
  justify-content: end;
  align-items: center;
}

.nav-item {
  width: 80%;
  text-align: center;
  cursor: pointer;
  transition: ease 0.3s;
  border-radius: 5px;
}

.nav-item:hover {
  color: #fff;
  background-color: gray;
}

.active {
  color: white;
  background-color: #000;
}
.menu {
  width: 2.7rem;
}

.logo-link {
  text-decoration: none;
  color: #000;
}

.msg_badge {
  position: absolute;
  top: 0.3rem;
  right: 0;
}
</style>