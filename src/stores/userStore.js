import { defineStore } from "pinia";
import axios from "axios";
import { cw_endpoint } from "@/constant/endpoint";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userId: null,
    user: null,
    userName: null,
    isLoggedIn: false,
    messages: null,
    cookieName: "token",
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
          this.userName = res.data.userName;
          console.log("user fetched");
          // console.log(res.data);
          return res.data;
        }
      } catch (err) {
        console.error("Error getting user data", err, err.message);
      }
    },

    async getChats(users) {
      try {
        console.log(users);
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
  },
});
