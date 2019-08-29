<template>
  <div class="item">
    <div class="top">
      <div class="avatar"></div>
      <div class="name">{{server.name}}</div>
    </div>
    <div class="bottom">
      <div class="description">{{server.description}}</div>
      <div class="button" :class="{selected: joinClicked || joined}" @click="joinButton">
				<span v-if="joined">Joined</span>
				<spinner v-else-if="joinClicked" :size="30"/>
				<span v-else-if="!joinClicked">Join Server</span>
			</div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner";
import ServerService from "@/services/ServerService";
export default {
	components: {Spinner},
  props: [
		'server',
	],
	data() {
		return {
			joinClicked: false,
		}
	},
	methods: {
		async joinButton(event) {
      if (this.joinClicked|| this.joined) return;
			this.joinClicked = true;
			return;
      const { ok, error, result } = await ServerService.joinServer(
        
      );
      if (ok) {
        this.closeMenu();
      }
    }
	},
	computed: {
		joined() {
      return this.$store.getters["servers/servers"][this.server.server_id];
    }
	}
};
</script>

<style lang="scss" scoped>
    .item {
      width: 250px;
      height: 270px;
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
        height: 140px;
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
          font-size: 23px;
        }
      }
      .bottom {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.194);
        flex: 1;
        .description {
          margin: 20px;
          margin-top: 20px;
          margin-bottom: 10px;
          height: 100%;
          opacity: 0.9;
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
          margin-bottom: 10px;
          margin-right: 10px;
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