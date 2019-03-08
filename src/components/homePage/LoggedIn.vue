<template>
  <div class="logged-in">
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
  color: white;

  margin-top: 10px;
}

.card{
  background-color: rgba(0, 0, 0, 0.041);
  padding: 20px;

  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  align-self: center;
  justify-content: center;
  justify-items: center;
  text-align: center;
}

.title {
  display: table;
  margin: auto;
  margin-top: 10px;
  font-size: 25px;
  text-align: center;
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
  margin-top: 20px;
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
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 30px;
  transition: 0.3s;
  font-size: 17px;
}
.button:hover {
  background: rgba(0, 0, 0, 0.582);
}

.button.logout{
  background: rgba(219, 36, 36, 0.438);
}
.button.logout:hover {
  background: rgba(255, 18, 18, 0.582);
}
</style>
