
<script setup>
import LandingSection from "@/components/LandingSection.vue";
import CardsSection from "@/components/CardsSection.vue";

import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const socket = userStore.socket;

onMounted(async () => {
  await userStore.getUserData();
  userStore.connect_user_to_socket();
  socket.on("newMessage", async () => {
    try {
      const user = await userStore.getUserData();
      console.log("new message received");
      console.log("hasRead: ", userStore.newMessage);

      if (!user) {
        console.log("user is Undefined");
      }
    } catch (err) {
      console.log("Error: " + err.message + ":" + err);
    }
  });
});
</script>

<template>
  <LandingSection />
  <CardsSection />
</template>
<style scoped>
</style>