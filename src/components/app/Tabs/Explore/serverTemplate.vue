<template>
  <div class="item">
    <div class="top">
      <profile-picture
        size="90px"
        :url="`${avatarDomain}/${server.server.avatar}`"
      />
      <div class="name">
        <div class="name-container">
          <span class="inner-name">{{server.server.name}}</span> 
          <span class="material-icons"  v-if="server.verified">check</span>
       </div>
      </div>
    </div>
    <div class="bottom">
      <div class="description">{{server.description}}</div>
      <div class="buttons">
        <div class="member-count"><div class="material-icons">account_box</div>{{server.total_members}}</div>
        <div class="button" :class="{selected: joined}" @click="joinButton">
          <span v-if="joined">Joined</span>
          <spinner v-else-if="joinClicked" :size="30"/>
          <span v-else-if="!joinClicked">Join Server</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '@/main'
import Spinner from "@/components/Spinner";
import ServerService from "@/services/ServerService";
import config from "@/config.js";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";

export default {
	components: {Spinner, ProfilePicture},
  props: [
		'server',
	],
	data() {
		return {
      joinClicked: false,
      avatarDomain: config.domain + "/avatars"
		}
	},
	methods: {
		async joinButton(event) {
      if (this.joinClicked|| this.joined) return;
			this.joinClicked = true;

      const { ok, error, result } = await ServerService.joinServerById(this.server.server.server_id, {
        socketID: this.$socket.id
      });      
      if (ok) {
        this.joinClicked = false;
      }
    }
	},
	computed: {
		joined() {
      return this.$store.getters["servers/servers"][this.server.server.server_id];
    },
    channels() {
      return this.$store.getters.channels;
    }
	}
};
</script>

<style lang="scss" scoped>
    .item {
      width: 250px;
      height: 300px;
      background: rgba(0, 0, 0, 0.479);
      opacity: 0.9;	
      margin: 5px;
      flex-shrink: 0;
      border-radius: 10px;
      transition: 0.3s;
      display: flex;
			flex-shrink: 0;
      flex-direction: column;
      overflow: hidden;
      &:hover {
        opacity: 1;
      }
      .top {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 150px;
        justify-content: center;
        align-content: center;
        align-items: center;
        flex-shrink: 0;
        .avatar {
          background: rgb(26, 133, 255);
          height: 80px;
          width: 80px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .name {
          margin-top: 9px;
          font-size: 21px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: center;
          display: flex;
          .name-container {
            display: flex;
            margin: auto;
          }
          .inner-name {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis
          }
          .material-icons {
            color: #66e0ff;
            margin-left: 5px;
          }
        }
      }
      .bottom {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.194);
        flex: 1;
        height: 100%;
        flex-shrink: 0;
        .description {
          margin: 10px;
          flex: 1;
          opacity: 0.9;
          overflow: auto;
          font-size: 14px;
          word-break: break-word;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          flex-shrink: 0;
        }
        .buttons {
          display: flex;
          width: 100%;
          flex-direction: row;
        }
        .member-count {
          display: flex;
          align-items: center;
          align-content: center;
          margin-left: 10px;
          margin-top: 0px;
          width: 100%;
          .material-icons { margin-right: 5px;}
        }
        .button {
					display: flex;
					align-content: center;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					flex-shrink: 0;
          background: rgba(40, 140, 255, 0.8);
          border-radius: 5px;
          align-self: flex-end;
          flex-shrink: 0;
          margin: auto;
          margin-right: 10px;
          margin-left: 0;
          margin-bottom: 10px;
          padding: 7px;
          transition: 0.3s;
					width: 80px;
					height: 20px;
          cursor: pointer;
          &:hover {
            background: rgb(40, 140, 255);
          }
					&.selected {
						background: grey;
					}
        }
      }
    }
</style>