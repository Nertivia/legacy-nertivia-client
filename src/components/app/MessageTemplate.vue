<template>
	<div :class="{message: true, ownMessage: user.uniqueID === $props.uniqueID}">
		<div class="profile-picture" :style="`background-image: url(${userAvatar})`"></div>
		<div class="triangle">
			<div class="triangle-inner"></div>
		</div>
		<div class="content">
			<div class="user-info">
                <div class="username">{{this.$props.username}}</div>
                <div class="date">{{getDate}}</div>
            </div>
			<div class="content-message" v-html="formatMessage"></div>
		</div>
		<div class="sending-status">{{statusMessage}}</div>
	</div>
</template>


<script>
import messageFormatter from '@/messageFormatter.js'
import config from '@/config.js'
import friendlyDate from '@/date'
export default {
	props: ['message', 'status', 'username', 'avatar', 'date', 'uniqueID'],
	computed: {
        formatMessage() {
            return messageFormatter(this.$props.message)
        },
        getDate() {
            return friendlyDate(this.$props.date);
        },
		userAvatar() {
			return config.domain + "/avatars/" + this.$props.avatar
		},
		statusMessage(){
			let status = this.$props.status;

			if (status == 0) {
				return "Sending"
			} else if (status == 1) {
				return "Sent"
			} else if (status == 2) {
				return "Failed"
			} else {
				return ""
			}
        },
        user() {
            return this.$store.getters.user
        }
	}
}
</script>


<style scoped>

.message{
    margin: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;

    animation: showMessage .3s ease-in-out;
}

.ownMessage .triangle-inner{
    border-right: 7px solid rgba(184, 184, 184, 0.219);
}
.ownMessage .content{
    background: rgba(184, 184, 184, 0.219);

}

@keyframes showMessage {
    from {
        transform: translate(0px, 9px);
        opacity: 0;
    }
}

.profile-picture{
    height: 50px;
    width: 50px;
    background-color: rgba(0, 0, 0, 0.281);
    margin: auto;
    margin-bottom: 0;
    border-radius: 50%;
    margin-right: 5px;
    margin-left: 0;
    flex-shrink: 0;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.triangle{
    display: flex;
    justify-content: bottom;
    flex-direction: column;
    margin: auto;
    margin-left: 0;
    margin-right: 0px;
    margin-bottom: 8.7px;
}
.triangle-inner{
    width: 0;
    height: 0;

    border-top: 1px solid transparent;
    border-bottom: 7px solid transparent;
    border-right: 7px solid rgba(0, 0, 0, 0.301);
}

.content{
    background: rgba(0, 0, 0, 0.301);
    padding: 10px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;
    color: rgb(231, 231, 231);
    margin: auto;
    margin-left: 0;
    margin-right: 0;
    transition: 1s;
}
.user-info {
    display: flex;
}
.username {
    color: rgb(219, 219, 219);
    font-size: 14px;
    margin: auto;
    margin-left: 0;
    margin-right: 0;
}
.date{
    color: rgb(161, 161, 161);
    font-size: 10px;
    margin: auto;
    margin-left: 5px;

}
.content-message {
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    font-size: 14px;
    overflow: hidden;
    color: white;
}

.message .sending-status {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    padding-bottom: 5px;
    margin-left: 10px;
    font-size: 15px;
    color: white;
    align-self: normal;
    user-select: none;
    transition: 0.5;
}


</style>

<style>
.codeblock{
    background-color: rgba(0, 0, 0, 0.397);
    padding: 5px;
    border-radius: 5px;
}
</style>
