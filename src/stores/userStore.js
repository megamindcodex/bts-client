import { defineStore } from "pinia";
import axios from "axios";
import { cw_endpoint, socektIo_endpoint } from "@/constant/endpoint";
import { io } from "socket.io-client";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    socket: io(socektIo_endpoint),
    userId: null,
    user: null,
    userName: null,
    isLoggedIn: false,
    messages: null,
    cookieName: "token",
    newMessage: null,
    receiverName: "Administrator",
  }),
  actions: {
    async getTokenFromCookies(cookieName) {
      try {
        const cookies = document.cookie
          .split(";")
          .map((cookie) => cookie.trim().split("=")) //split each cookies into [name, value] pairs
          .map(([name, value]) => ({ name, value })); //map each pairs to an object

        // Find the cokie with the specified name
        const foundCookie = cookies.find(
          (cookie) => cookie.name === cookieName
        );

        if (foundCookie) {
          this.isLoggedIn === true;
        } else {
          this.isLoggedIn = false;
        }

        // If the cookie is found with the specified name
        return foundCookie ? decodeURIComponent(foundCookie.value) : null;
      } catch (err) {
        console.log("Error getting token");
        return null;
      }
    },
    async getUserData() {
      try {
        // Retrieve the token from the cookies
        const token = await this.getTokenFromCookies(this.cookieName);

        // Update isLoggedIn based on whether a token is found
        this.isLoggedIn = !!token;
        // console.log(this.isLoggedIn);

        // console.log(token);

        if (!token) {
          console.error("token is undefined");
          return null;
        }
        this.token = token;
        // Include the token in the Authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`${cw_endpoint}/fetchUserData`, config);

        if (res.status === 200) {
          this.user = res.data;
          this.userId = this.user._id;
          this.userName = this.user.userName;
          console.log("user fetched");
          const userName = this.userName;
          const receiverName = this.receiverName;
          const chatRooms = this.user.chatRooms;
          const chatMessage = await this.setChatMessage(
            userName,
            receiverName,
            chatRooms
          );

          if (chatMessage) {
            this.newMessage = !chatMessage.hasRead;
            console.log(this.newMessage);
          }
          return res.data;
        }
      } catch (err) {
        console.error("Error getting user data", err, err.message);
      }
    },
    async connect_user_to_socket() {
      try {
        await this.getUserData();
        if (!this.user) {
          console.log("User is undefined");
        }
        this.socket.emit("join", this.userName);
        console.log(`user ${this.userName} connected to socket`);
      } catch (err) {
        console.log("Error connecting user to socekt", err, err.message);
      }
    },

    async getChats(users) {
      try {
        // console.log(users);
        const token = await this.getTokenFromCookies(this.cookieName);

        if (!token) {
          console.error("token is undefined");
          return null;
        }

        // Include the token in the Authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            users: users,
          },
        };
        // console.log(config);
        // console.log(users);
        const res = await axios.get(`${cw_endpoint}/get_chats`, config);

        if (res.status === 200) {
          // console.log(res.data);
          return res.data;
        }
      } catch (err) {
        console.log("Error getting chats", err, err.message);
      }
    },
    async setChatMessage(userName, receiverName, chatRooms) {
      const chatMessage = chatRooms.find(
        (chatRoom) =>
          chatRoom.users.includes(userName) &&
          chatRoom.users.includes(receiverName)
      );

      if (!chatMessage) {
        console.log("Couldn't find the specific chat message");
      } else {
        return chatMessage;
        // console.log(`hasRead: ${chatMessage.hasRead}`);
        // await userStore.toggleNewMessage(!chatMessage.hasRead);
        // console.log(userStore.newMessage);
      }
    },
    // async toggleNewMessage(bollean) {
    //   console.log(bollean);
    //   this.newMessage = bollean;
    //   // console.log(this.newMessage);
    // },
  },
});
