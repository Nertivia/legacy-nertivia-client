<template>
  <div class="member" @click="openUserInformation()">
    <Profile-picture 
      class="avatar"
      :url="userAvatar"
      size="35px"
    />
    <div class="information">
      <div class="username">{{user.username}}</div>
    </div>
    <div v-if="type === 'OWNER'" class="type-box">Owner</div>
  </div>
</template>


<script>
import ProfilePicture from '@/components/ProfilePictureTemplate';
import config from '@/config';
export default {
  components: { ProfilePicture },
  props: ['user', 'avatar', 'type'],
  methods: {
    openUserInformation() {
      this.$store.dispatch('setUserInformationPopout', this.user.uniqueID)
    },
  },
  computed: {
    userAvatar() {
      return config.domain + "/avatars/" + this.avatar  
    } 
  }
  
}
</script>


<style scoped>
.member {
  display: flex;
  padding: 3px;
  margin: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
  align-items: center;
  align-content: center;
  border-radius: 10px;
  transition: 0.3s;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
}
.member:hover {
  background: rgba(0, 0, 0, 0.301);
}
.information {
  margin-left: 5px;
  overflow: hidden;
  flex: 1;
}
.username { 
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-box{
  padding: 3px;
  border-radius: 5px;
  height: 100%;
  background: rgb(255, 71, 71);
}

.avatar {
 
}

</style>
