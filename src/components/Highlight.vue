
<script setup>
import { ref } from "vue";

const celebName = ref("Adele Laurie");
</script>
<template>
  <div class="cont">
    <p>Purchase Your Exclusive Membership Card Now and Enjoy VIP Privileges!</p>
    <!-- <p>
      Unveil the Exclusive World of {{ celebName }} Membership. Dive into a
      realm of unparalleled privileges and experiences tailored just for you
    </p> -->

    <div class="high-light">
      <v-sheet class="bottom-border pb-5">
        <p>
          Embrace Your Status with <strong>{{ celebName }}</strong> Membership.
          Unlock exclusive privileges and elevate your experience with VIP
          access, personalized perks, and more
        </p>
      </v-sheet>
      <v-sheet class="bottom-border pb-5 mt-10">
        <h4 class="mb-4">
          Explore Your Membership Options. Choose the Perfect Card for You
        </h4>
        <p class="px-2">
          Here, you'll discover the exclusive privileges and benefits that come
          with each membership tier. Take a closer look at our three distinct
          cards – Sapphire, Gold, and Platinum – and find the one that best
          suits your lifestyle and preferences. Whether you're seeking VIP
          access, personalized experiences, or premium perks, we have the
          perfect membership card for you. Dive in below to learn more and start
          your journey with us today!"
        </p>
      </v-sheet>
    </div>
  </div>
</template>

<style scoped>
.cont {
  width: 100%;
  padding: 0.5rem;
  font-family: "Saira Condensed", sans-serif;
}

.cont > :first-child {
  text-align: center;
}
.high-light {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 20px;
}

.bottom-border {
  border-bottom: 1px solid #000;
}
</style>