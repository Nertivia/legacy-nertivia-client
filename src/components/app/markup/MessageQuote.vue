<template>
  <article class="quote">
    <header class="section">
      Quoted:
      <span class="username">{{ this.quote.creator.username }}</span>
    </header>
    <main class="message">
      <Markup v-if="formattingEnabled" :text="quote.message" :message="message" />
      <div v-else>{{this.quote.message}}</div>
    </main>
    <footer class="section">
      <div class="go-to-message" v-on:click="goToMessage">Go to message</div>
    </footer>
  </article>
</template>

<script>
import { bus } from "@/main";

export default {
  props: ["quote", "formattingEnabled", "message"],
  components: {
    Markup: () => import("../Markup.vue")
  },
  methods: {
    openUserInfo: function() {
      this.$store.dispatch(
        "setUserInformationPopout",
        this.quote.creator.uniqueID
      );
    },
    goToMessage: function() {
      bus.$emit("message:scrollTo", this.quote.messageID);
    }
  }
};
</script>

<style scoped>
.quote {
  background: rgba(0, 0, 0, 0.3);
  display: block;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
  margin-top: 5px;
}

.section {
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  font-weight: bold;
}

.username {
  font-weight: initial;
  cursor: pointer;
}

.username:hover {
  text-decoration: underline;
}

.message {
  padding: 5px;
}

.go-to-message {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  user-select: none;
}

.go-to-message:hover {
  color: white;
}
</style>