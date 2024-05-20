
<script setup>
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { cw_endpoint, socektIo_endpoint } from "@/constant/endpoint";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const messages = ref([]);
const newMessage = ref("");
const socket = userStore.socket;
const receiverName = ref("Administrator");
const user = ref(null);
const showMessage = ref(false);
const isTyping = ref(false);
const isLoading = ref(false);
const noConvo = ref(true);
const hasRead = ref(false);
const chatPanel = ref(null);

const scrollToLastMessage = () => {
  if (chatPanel.value) {
    nextTick(() => {
      chatPanel.value.scrollTop = chatPanel.value.scrollHeight;
    });
  }
};

const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be converted to 12

  // Add leading zero to minutes if less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes}${ampm} `;
};

// listen for incoming messages
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserData();

  user.value = userStore.user;
  const userName = user.value.userName;

  // console.log(user.value.userName);
  if (!user.value) {
    console.log("user is undifined");
  }

  // await userStore.connect_user_to_socket();

  const users = ref([userName, receiverName.value]);
  const conversation = await userStore.getChats(users.value);

  if (conversation) {
    console.log(conversation.messages);
    noConvo.value = false;
    isLoading.value = false;
    messages.value.push(...conversation.messages);
    scrollToLastMessage();
  } else {
    noConvo.value = true;
    isLoading.value = false;
  }

  socket.emit("join", userName, receiverName.value, userStore.token);
  console.log(userStore.token);

  socket.on("message", (message) => {
    // console.log(message)
    // console.log(messages.value)
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
      timeStamp: getCurrentTime(),
    };
    // console.log(message)

    messages.value.push(message);
    noConvo.value = false;
    scrollToLastMessage();
    // const condition = ref(false);
    // toggle_hasRead(receiverName.value, condition.value);
    socket.emit("message", receiverName.value, message);
    // console.log(`${receiverName.value}: ${message}`);
    newMessage.value = "";
    saveMessageToDatabase(
      receiverName.value,
      message.message,
      message.timeStamp
    );
  }
};

const typing = () => {
  socket.emit("isTyping", receiverName.value);
};

const typingStoped = () => {
  socket.emit("typingStoped", receiverName.value);
};

let typingTimeout;
socket.on("isTyping", () => {
  console.log("Typing");
  isTyping.value = true;

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    console.log("Typing stopped");
    isTyping.value = false;
  }, 4000);
});

socket.on("typingStoped", () => {
  console.log("Typing stopped");
  isTyping.value = false;
});

const saveMessageToDatabase = async (receiver, message, timeStamp) => {
  try {
    // console.log(receiver, message, timeStamp);
    const cookieName = "token";
    const token = await userStore.getTokenFromCookies(cookieName);
    // console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(
      `${cw_endpoint}/saveMessage`,
      { receiver, message, timeStamp },
      config
    );

    if (res.status === 200) {
    }
  } catch (err) {
    console.error("Error saving message to database:", err);
    throw err; // Throw the error for consistent error handling
  }
};

// const popUp = () => {
//   setTimeout(() => {
//     showMessage.value = true;
//   }, 3000);
// };

const toggle_hasRead = async (receiverName, condition) => {
  try {
    // console.log(receiverName, condition);
    const cookieName = ref("token");
    const token = await userStore.getTokenFromCookies(cookieName.value);

    if (!token) {
      console.log("token is undefined");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(config);

    const res = await axios.put(
      `${cw_endpoint}/toggle_hasRead`,
      { receiverName, condition },
      config
    );
    if (res.status === 200) {
      hasRead.value = res.data.hasRead;
      console.log(`${receiverName} has read is ${hasRead.value}`);
    }
  } catch (err) {
    console.error("Error changing hasRead to true:", err, err.message);
  }
};
</script>

<template>
  <div class="container">
    <div class="head">
      <i class="fa-solid fa-chevron-left pa-2" @click="router.push('/')"></i>
      <div class="dp">
        {{ receiverName.toUpperCase().slice(0, 1) }}
      </div>
      <span class="text-white">{{ receiverName }} </span>
      <p class="typing" v-show="isTyping">typing....</p>
    </div>
    <!-- <v-text-field
      type="text"
      density="compact"
      variant="outlined"
      hide-details
      placeholder="input receiver name"
      v-model="receiverName"
      class="receiverName"
    /> -->
    <div class="chat-panel" ref="chatPanel" v-if="messages">
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
          <span class="d-flex flex-column">
            <p class="text">{{ message.message }}</p>
            <small class="timeStamp">{{ message.timeStamp }}</small>
          </span>
        </div>
      </div>
    </div>
    <div class="chat-panel" v-if="noConvo">
      <span class="no-chat-txt">No chats available!</span>
    </div>
    <div v-show="isLoading" class="chat-panel isLoading">
      <span class="loading-txt">Loading chats....</span>
    </div>
    <div class="input-area pr-0 pl-5">
      <v-textarea
        @input="typing"
        @blur="typingStoped"
        placeholder="Type a message...."
        rows="1"
        hide-details
        auto-grow
        no-resize
        density="compact"
        class="input ml-4"
        v-model="newMessage"
      ></v-textarea>
      <div class="btn ml-3">
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
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #dddddd;
}

.head {
  display: flex;
  align-items: center;
  column-gap: 0.8rem;
  width: 100%;
  height: 10%;
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.4rem;
  color: rgb(179, 75, 2);
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
  height: 80%;
  background-color: #dddddd;
  padding: 0.5rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.input-area {
  display: flex;
  width: 100%;
  height: 10%;
  align-items: center;
  background-color: trsansparent;
}

.input {
  width: 100%;
  border-radius: 30px;
  background-color: #2a3e51;
  color: #fff;
  overflow: auto;
}

.btn {
  display: flex;
  /* justify-content: start; */
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

.text {
  font-size: 16.5px;
}

.timeStamp {
  font-size: 13px;
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
  position: relative;
  padding: 0.5rem;
  border-radius: 0px 10px 10px 5px;
  background-color: #2a3e51;
  margin-right: 3rem;
}

.msg_txt span small {
  align-self: start;
  padding-left: 0.5rem;
  color: #dcc0c0;
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
  margin-left: 3rem;
}

.sender_txt span small {
  align-self: end;
  color: #dcc0c0;
}

.receiverName {
  width: 100%;
  background-color: #2f5071;
  color: #fff;
}

.typing {
  font-size: 17px;
  color: rgb(150, 246, 5);
}

.isLoading {
  position: relative;
  top: -50%;
  left: -50%;
  transform: translate(50%, 50%);
}

.no-chat-txt {
  color: grey;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
}

.loading-txt {
  color: green;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
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
