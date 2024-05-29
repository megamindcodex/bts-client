
<script setup>
import Logo from "@/components/Logo.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const celebName = ref("Halle Berry");

const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <div class="cont" v-show="route.path !== '/chatRoom'">
    <RouterLink to="/" class="logo-link"><Logo /></RouterLink>
    <div class="pageLinks">
      <Router-link to="/">Home</Router-link>
      <Router-link to="/chatRoom">customer service</Router-link>
      <Router-link to="/login">Login</Router-link>
      <Router-link to="/signup">Signup</Router-link>
    </div>
    <div class="links">
      <i class="fa-brands fa-facebook mx-3"></i>
      <i class="fa-brands fa-square-twitter mx-3"></i>
      <i class="fa-brands fa-square-instagram mx-3"></i>
    </div>
    <div class="last">
      <p>&copy; {{ currentYear }} {{ celebName }}</p>
    </div>
  </div>
</template>


<style scoped>
.cont {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
}

.pageLinks {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;
}

.pageLinks a {
  text-decoration: none;
  font-weight: 500;
  color: #000;
  transition: ease 0.4s;
}

.pageLinks a:hover {
  color: red;
}
.links {
  display: flex;
  justify-content: center;
  width: 100%;
}
.links i {
  font-size: 28px;
  color: #000;
  cursor: pointer;
}

.last {
  width: 100%;
  text-align: center;
}

.last p {
  color: #000;
  font-size: 17px;
}

.logo-link {
  text-decoration: none;
  color: #000;
}
</style>