<template>
  <div class="logged-in">
    <div class="title">Welcome!</div>
    <div class="card">
      <div class="avatar-outer">
        <div class="avatar" :style="`background-image: url(${avatar})`"></div>
      </div>
      <div class="info">
          <div class="username">{{user.username}}<span class="tag">@{{user.tag}}</span></div>
          <div class="buttons">
            <button class="button" @click="openChat">Enter</button>
            <button class="button logout" @click="logout">Logout</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config.js'
export default {
  methods: {
    logout() {
      this.$store.commit('logout')
    },
    openChat() {
      window.location.href = "/app"
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    avatar() {
      return config.domain + "/avatars/" +this.$store.getters.user.avatar
    }
  }
}
</script>


<style scoped>
.logged-in {
  margin-top: 50px;
  color: white;
}

.card{
  background-color: rgba(0, 0, 0, 0.26);
  padding: 10px;
  margin: 20px;
  margin-bottom: 30px;
  display: flex;
}

.title {
  display: table;
  margin: auto;
  font-size: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.459);
  border-radius: 50%;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}

.info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-top: 5px;
}

.username {
  font-size: 20px;
  user-select: all;
}

.tag{
  font-size: 13px;
  color: rgb(194, 194, 194);
}

.buttons{
  display: flex;
}

.button {
  color: white;
  background: rgba(0, 0, 0, 0.308);
  padding: 10px;
  border: none;
  outline: none;
  margin-right: 5px;
  margin-top: 10px;
  transition: 0.3s;
}
.button:hover {
  background: rgba(0, 0, 0, 0.582);
}

.button.logout{
  background: rgba(149, 0, 0, 0.404);
}
.button.logout:hover {
  background: rgba(255, 0, 0, 0.582);
}
</style>
