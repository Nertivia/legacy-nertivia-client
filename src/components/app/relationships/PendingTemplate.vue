<template>
  <div class="pending-friend">
    <profile-picture
      class="avatar"
      :avatar="user.avatar"
      :uniqueID="user.uniqueID"
      animationPadding="0"
      :hover="hover"
      size="30px"
      @click.native="openUserInformation"
    />
    <div class="information">
      <div class="username">{{ friend.recipient.username }}</div>
      <div class="tag">@{{ friend.recipient.tag }}</div>
    </div>
    <div class="buttons">
      <div
        :class="{ button: true, accept: true, hide: friend.status == 0 }"
        @click="accept"
      >
        <i class="material-icons">check</i>
      </div>
      <div class="button decline" @click="deny">
        <i class="material-icons">not_interested</i>
      </div>
    </div>
  </div>
</template>

<script>
import RelationshipService from "@/services/RelationshipService.js";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";

export default {
  components: { ProfilePicture },
  props: ["friend"],
  computed: {
    user() {
      return this.$store.getters.user.friends[this.friend.recipient.uniqueID]
        .recipient;
    }
  },
  methods: {
    deny() {
      RelationshipService.delete(this.friend.recipient.uniqueID);
    },
    accept() {
      RelationshipService.put(this.friend.recipient.uniqueID);
    },
    openUserInformation() {
      this.$store.dispatch(
        "setUserInformationPopout",
        this.friend.recipient.uniqueID
      );
    }
  }
};
</script>

<style scoped>
.username {
  width: 119px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;
}
.pending-friend {
  color: white;
  padding-left: 15px;
  display: flex;
  transition: 0.3s;
}

.avatar {
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
  cursor: pointer;
}
.information {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
}
.tag {
  color: rgba(173, 173, 173, 0.8);
  font-size: 15px;
}

.buttons {
  display: flex;
  margin: auto;
  margin-right: 10px;
}

.button {
  border-radius: 4px;
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
.button .material-icons {
  margin: auto;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s;
}
.button:hover .material-icons {
  color: white;
}
.button.decline:hover .material-icons {
  color: rgb(255, 80, 80);
}
</style>
