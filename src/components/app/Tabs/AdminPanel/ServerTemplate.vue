<template>
  <div class="user">
    <profile-picture
      class="profile-picture"
      :avatar="server.avatar"
      animationPadding="0"
      :uniqueID="server.server_id"
      :hover="true"
      size="40px"
    />
    <div class="details" @click="openManageUser">
      <div class="username-tag">
        {{ server.name }}
      </div>
      <div class="date">{{ date }}</div>
    </div>
  </div>
</template>

<script>
import friendlyDate from "@/utils/date";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
export default {
  components: { ProfilePicture },
  props: ["server"],
  computed: {
    date() {
      return friendlyDate(this.server.created);
    },
  },
  methods: {
    openManageUser() {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "ADMIN_MANAGE_USER",
        user: this.user
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  margin: 5px;
  padding: 5px;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
.suspended {
  background: rgb(255, 45, 45);
  border-radius: 4px;
  padding: 3px;
  display: flex;
}
.profile-picture {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 5px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.date {
  font-size: 14px;
  opacity: 0.6;
}
</style>
