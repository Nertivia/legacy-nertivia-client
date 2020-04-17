<template>
  <div class="user">
    <div
      @click="openUserInformation"
      class="profile-picture"
      :style="{ backgroundImage: `url(${avatar})` }"
    ></div>
    <div class="details" @click="openManageUser">
      <div class="username-tag">
        {{ user.username }}<span class="tag">@{{ user.tag }}</span>
      </div>
      <div class="date" v-if="!presence">{{ date }}</div>
      <div class="presence" v-if="presence">{{ presence }}</div>
      <div class="suspended" v-if="user.banned">Suspended</div>
    </div>

  </div>
</template>

<script>
import friendlyDate from "@/utils/date";
import statuses from "@/utils/statuses";
import config from '@/config';
export default {
  props: ["user"],
  computed: {
    date() {
      return friendlyDate(this.user.created);
    },
    avatar() {
      return config.nertiviaCDN + this.user.avatar;
    },
    presence() {
      if (this.user.status === undefined) return null;
      return statuses[this.user.status].name;
    }
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.user.uniqueID);
    },
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
  background: rgba(0, 0, 0, 0.7);
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
.tag {
  opacity: 0.9;
}
.presence {
  opacity: 0.6;
  font-size: 14px;
}
</style>
