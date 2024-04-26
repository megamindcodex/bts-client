
<script setup>
import { ref } from "vue";
import Highlight from "@/components/Highlight.vue";

// Purchase Your Exclusive Membership Card Now and Enjoy VIP Privileges!
const greeting = ref("Elevate your membership experience with Nail Horan");
</script>

<template>
  <div class="cont mt-8">
    <div class="greeting">
      <span>
        {{ greeting }}
      </span>
    </div>
    <Highlight />
  </div>
</template>
<style scoped>
.cont {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
}
.greeting {
  display: flex;
  width: 100%;
  padding: 1rem;
}

.greeting span {
  font-family: "Saira Condensed", sans-serif;
  font-size: 8vw;
  color: #000;
  text-align: center;
}
</style>