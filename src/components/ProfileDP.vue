
<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
  const result = await userStore.getUserData();
  if (result) {
    user.value = result;
  }
});
</script>

<template>
  <div class="cont pa-2">
    <div class="dp"><i class="bx bx-user-circle"></i></div>
    <div class="userName" v-if="user">{{ user.userName }}</div>
  </div>
</template>

<style scoped>
.cont {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bx {
  font-size: 3rem;
}

.userName {
  font-size: 20px;
  font-weight: 600;
}
</style>