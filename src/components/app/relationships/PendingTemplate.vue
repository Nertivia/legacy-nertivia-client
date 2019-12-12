<template>
  <div class="pending-friend">
    <div
      class="profile-picture"
      :style="`background-image: url(${userAvatar})`"
      @click="openUserInformation"
    />
    <div class="information">
      <div class="username">
        {{ $props.username }}
      </div>
      <div class="tag">@{{ $props.tag }}</div>
    </div>
    <div class="buttons">
      <div
        :class="{ button: true, accept: true, hide: $props.status == 0 }"
        @click="accept"
      >
        <i class="material-icons">
          check
        </i>
      </div>
      <div class="button decline" @click="deny">
        <i class="material-icons">
          not_interested
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import RelationshipService from "@/services/RelationshipService.js";
import config from "@/config.js";

export default {
  props: ["username", "tag", "status", "uniqueID"],
  computed: {
    user() {
      return this.$store.getters.user.friends[this.$props.uniqueID].recipient;
    },
    userAvatar() {
      return config.domain + "/avatars/" + this.user.avatar;
    }
  },
  methods: {
    deny() {
      RelationshipService.delete(this.$props.uniqueID);
    },
    accept() {
      RelationshipService.put(this.$props.uniqueID);
    },
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.uniqueID);
    }
  }
};
</script>

<style scoped>
.username {
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;
}
.pending-friend {
  color: white;
  padding: 5px;
  padding-left: 22px;
  display: flex;
  transition: 0.3s;
}

.pending-friend:hover {
  background-color: rgba(0, 0, 0, 0.246);
}

.profile-picture {
  height: 30px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.425);
  border-radius: 50%;
  margin: auto;
  margin-right: 5px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
.information {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
}
.tag {
  color: rgb(173, 173, 173);
  font-size: 15px;
}

.buttons {
  display: flex;
  margin: auto;
  margin-right: 5px;
}

.button {
  background-color: rgba(65, 65, 65, 0.438);
  width: 30px;
  height: 30px;
  margin: 5px;
  display: flex;
  transition: 0.3s;
  cursor: pointer;
}
.hide {
  display: none;
}
.button:hover {
  background-color: rgba(0, 255, 0, 0.281);
}
.button .material-icons {
  margin: auto;
  color: rgba(255, 255, 255, 0.747);
}
.button.decline:hover {
  background-color: rgba(255, 0, 0, 0.281);
}
</style>
