<template>
  <article class="quote">
    <header class="section">
      Quoted:
      <span class="username">{{ this.quote.creator.username }}</span>
      <i title="Go to message" class="go-to-message material-icons" v-on:click="goToMessage">keyboard_arrow_up</i>
    </header>
    <main class="message">
      <Markup v-if="formattingEnabled" :text="quote.message" :message="message" />
      <div v-else>{{this.quote.message}}</div>
    </main>
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
  align-items: center;
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
  margin-left: auto;
  user-select: none;
  padding-left: 0.75rem;
}

.go-to-message:hover {
  color: white;
}

.material-icons {
  align-self: center;
  flex-shrink: 0;
  font-size: 1.25rem;
}
</style>