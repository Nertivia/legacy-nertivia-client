<template>
	<span class="mention" v-on:click="openUserInfo">@{{this.member.username}}</span>
</template>

<script>
	export default {
		props: ["member"],
		methods: {
			openUserInfo: function() {
				this.$store.dispatch('setUserInformationPopout', this.member.uniqueID)
			}
		}
	}
</script>

<style scoped>
	.mention {
	  background: rgba(0, 0, 0, 0.3);
	  color: rgb(94, 164, 255);
	  font-weight: bold;
	  border-radius: 4px;
	  padding: 2px;
	  cursor: pointer;
	  transition: 0.2s;
	  display: inline-block;
	}
	.mention:hover {
	  background: rgba(0, 0, 0, 0.5);
	}
</style>