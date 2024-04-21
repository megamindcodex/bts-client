
<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { cw_endpoint, socektIo_endpoint } from "@/constant/endpoint";

const userStore = useUserStore();

const messages = ref([]);
const newMessage = ref("");
const socket = io(socektIo_endpoint);
const receiverName = ref("codex001");
const user = ref(null);
const showMessage = ref(false);

// Create a reactive reference to the last message element
const lastMessageElement = ref(null);

const scrollToLastMessage = () => {
  if (lastMessageElement.value) {
    lastMessageElement.value.scrollIntoView({ behavior: "smooth" });
  }
};

// listen for incoming messages
onMounted(async () => {
  await userStore.getUserData();

  user.value = userStore.user;
  const userName = user.value.userName;

  console.log(user.value.userName);
  if (!user.value) {
    console.log("user is undifined");
  }

  const users = ref(["emmanvictor", "codex001"]);
  const conversation = await userStore.getChats(users.value);

  scrollToLastMessage();
  messages.value.push(...conversation.messages);

  console.log(conversation.messages);

  socket.emit("join", userName);

  socket.on("message", (message) => {
    console.log(message);
    console.log(messages.value);
    messages.value.push(message);
    scrollToLastMessage();
  });
});

watch(messages, () => {
  scrollToLastMessage();
});

// function to send message
const sendMessage = () => {
  const user = userStore.user;
  // console.log(user);
  if (newMessage.value.trim() !== "") {
    const message = {
      sender: user.userName,
      message: newMessage.value,
    };
    console.log(message);

    messages.value.push(message);
    scrollToLastMessage();
    socket.emit("message", receiverName.value, message);
    // console.log(`${receiverName.value}: ${message}`);
    newMessage.value = "";
    saveMessageToDatabase(receiverName.value, message.message);
  }
};

const saveMessageToDatabase = async (receiver, message) => {
  try {
    console.log(receiver, message);
    const cookieName = "token";
    const token = await userStore.getTokenFromCookies(cookieName);
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(
      `${cw_endpoint}/saveMessage`,
      { receiver, message },
      config
    );

    if (res.status === 200) {
      popUp();
    }
  } catch (err) {
    console.error("Error saving message to database:", err);
    throw err; // Throw the error for consistent error handling
  }
};

const popUp = () => {
  setTimeout(() => {
    showMessage.value = true;
  }, 3000);
};
</script>

<template>
  <div class="popUp" v-if="showMessage">
    message saved to database successfully
  </div>
  <div class="container">
    <div class="head">
      <i class="fa-solid fa-chevron-left pa-2" @click="navigateTo"></i>
      <div class="dp"></div>
      <span class="text-white">{{ userStore.userName }}</span>
    </div>
    <!-- <input
      type="text"
      placeholder="input receiver name"
      v-model="receiverName"
      class="mt-10"
    /> -->
    <div class="chat-panel" v-if="messages">
      <span></span>
      <div
        class="msg-block"
        v-for="(message, index) in messages"
        :key="`messsage-${index}`"
        :ref="
          (el) => {
            if (index === messages.length - 1) lastMessageElement = el;
          }
        "
      >
        <div
          :class="{
            sender_txt: message.sender === userStore.user.userName,
            msg_txt: message.sender !== userStore.user.userName,
          }"
        >
          <span>{{ message.message }}</span>
        </div>
      </div>
    </div>
    <div class="input-area pa-3 pr-0 pl-5 ga-2">
      <v-textarea
        placeholder="Type a message...."
        rows="1"
        hide-details
        auto-grow
        no-resize
        density="compact"
        class="input"
        v-model="newMessage"
      ></v-textarea>
      <div class="btn">
        <button @click="sendMessage">
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap");

* {
  font-family: "Exo 2", sans-serif;
}
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.head {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  column-gap: 0.8rem;
  width: 100%;
  padding: 1.2rem;
  background-color: #222831;
  /* border-radius: 0px 0px 18px 18px; */
}

.fa-chevron-left {
  color: #fff;
  font-size: 23px;
}

.head span {
  font-size: 19px;
}

.dp {
  width: 40px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: #000;
}
.chat-panel {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: 100dvh;
  background-color: #dddddd;
  padding: 0.5rem;
  /* margin-top: 100px; */
  overflow-x: scroll;
}

.input-area {
  display: flex;
  position: relative;
  bottom: 0;
  display: flex;
  width: 100%;
  align-items: center;
  background-color: #d2d0d0;
  /* background: blue; */
}

.input {
  width: 100%;
  border-radius: 30px;
  background-color: #2a3e51;
  color: #fff;
  /* overflow: auto; */
}

.btn {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 30%;
  aspect-ratio: 1/1;
}
.btn button {
  text-align: center;
  font-size: 20px;
  width: 55%;
  height: 55%;
  border-radius: 50%;
  background-color: #176b87;
  color: #fff;
}

.msg-block {
  display: flex;
  width: 100%;
  color: white;
  font-size: 14px;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}

.msg_txt {
  display: flex;
  justify-content: start;
  width: 100%;
}

.msg_txt span {
  padding: 0.5rem;
  border-radius: 0px 10px 10px 5px;
  background-color: #2a3e51;
}

.sender_txt {
  display: flex;
  justify-content: end;
  width: 100%;
}

.sender_txt span {
  padding: 0.5rem;
  border-radius: 10px 0px 5px 10px;

  background-color: #2f5071;
}

/*.content {
  background-color: green;
  width: max-content;
  padding: 0.3rem;
}

.message-block {
  width: 100%;
  display: flex;
  color: white;
} */
</style>