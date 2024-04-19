import { defineStore } from "pinia";
import { computed } from "vue";

export const useCookieStore = defineStore("cookieStore", {
  state: () => ({
    token: null,
  }),
  actions: {
    setCookies(token) {
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1};`;
    },
  },
});
