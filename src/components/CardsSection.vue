

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();
const isLoggedIn = ref(null);

const membershipCards = ref([
  {
    id: "001",
    type: "Black",
    price: "$1000",
    description:
      "Experience the entry-level membership with exclusive benefits tailored for dedicated fans. Unlock VIP access to events, enjoy a 10% discount on merchandise, and gain access to exclusive content.",
    privileges: [
      "VIP Access to Events",
      "10% Discount on Merchandise",
      "Exclusive Content Access",
    ],
    img: "https://img.freepik.com/free-vector/black-credit-card_1017-6276.jpg?t=st=1713315128~exp=1713318728~hmac=92099ddfc6cb15ee39cbd21e7046bd27991b6b9074e90ab1df4daf00f4b08df6&w=740",
    expandPanel: false,
  },
  {
    id: "002",
    type: "Gold",
    price: "$2000",
    description:
      "Elevate your membership experience with enhanced privileges and personalized perks. Enjoy VIP access to events, a 20% discount on merchandise, and personalized experiences.",
    privileges: [
      "VIP Access to Events",
      "20% Discount on Merchandise",
      "Personalized Experiences",
    ],
    img: "https://img.freepik.com/free-vector/realistic-credit-card-design_23-2149125290.jpg?t=st=1713315313~exp=1713318913~hmac=2492ba6ef774ae2b8626031c9907cd841f14d3f177e93cdf68f84aca41206843&w=996",
    expandPanel: false,
  },
  {
    id: "003",
    type: "Platinum",
    price: "$3000",
    description:
      "Indulge in the ultimate membership experience with premium benefits and exclusive perks. Gain VIP access to events, a 30% discount on merchandise, priority services, and access to exclusive merchandise.",
    privileges: [
      "VIP Access to Events",
      "30% Discount on Merchandise",
      "Priority Services",
      "Exclusive Merchandise",
    ],
    img: "https://img.freepik.com/premium-photo/silver-credit-card-template-isolated-white-background-3d-illustration_118047-5089.jpg?w=900",
    expandPanel: false,
  },
]);

// Toggle the expanded state for the clicked card

const toggleExpand = (id) => {
  membershipCards.value.forEach((card) => {
    if (card.id === id) {
      card.expandPanel = !card.expandPanel;
    }
  });
};

onMounted(async () => {
  await userStore.getUserData();
  isLoggedIn.value = userStore.isLoggedIn;
  // console.log(isLoggedIn.value);

  // if (!isLoggedIn) {
  //   const routeName = ref("/login");
  //   goToChatRoom(R);
  // }
});

const goToChatRoom = () => {
  if (!isLoggedIn.value) {
    console.log(isLoggedIn.value);
    router.push("/login");
  } else {
    router.push("/chatRoom");
  }
};
</script>

<template>
  <div id="card" class="cards" v-if="membershipCards">
    <v-card class="card pa-2" v-for="card in membershipCards" :key="card.id">
      <v-img height="200px" :src="card.img" cover> </v-img>
      <div class="head">
        <v-card-title class="card-type">{{ card.type }}</v-card-title
        ><span class="card-price text-h5">{{ card.price }}</span>
      </div>
      <v-card-text>{{ card.description }}</v-card-text>
      <v-card-actions class="card-actions">
        <button class="purchase-btn" @click="goToChatRoom">
          <i class="fa-solid fa-comment"></i><span>chat to purchase</span>
        </button>
        <button @click="toggleExpand(card.id)" class="toggle-btn">
          <span>more</span>
          <div>
            <i class="fa-solid fa-angle-down" v-if="!card.expandPanel"></i>
            <i class="fa-solid fa-angle-up" v-if="card.expandPanel"></i>
          </div>
        </button>
      </v-card-actions>

      <v-expand-transition>
        <div class="card-privilege" v-show="card.expandPanel">
          <v-card-text v-for="privilege in card.privileges" :key="privilege">
            {{ privilege }}
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<style scoped>
.cards {
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
}

.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-type {
  color: #000;
}
.card-price {
  color: #000;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.purchase-btn {
  width: fit-content;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  border: 1.5px solid black;
  font-size: 17px;
  font-weight: 500;
  border-radius: 4px;
  transition: ease 0.5;
}

.purchase-btn:hover {
  color: white;
  background-color: #000;
  transition: ease-in-out 0.3s;
}

.purchase-btn:hover i {
  color: #fff;
}

.purchase-btn i {
  color: black;
  transition: ease-in-out 0.3s;
}

.toggle-btn {
  width: fit-content;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
  color: red;
}

.card-privilege {
  display: flex;
  flex-direction: column;
}
</style>