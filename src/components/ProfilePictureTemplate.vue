<template>
  <div class="outer-profile-picture">
    <div
      :class="`profile-picture ${admin && adminType ? adminType.name : ''}`"
      :style="`padding: ${$props.animationPadding || '3px'}`"
    >
      <img
        v-if="adminType"
        class="emote"
        :src="adminType.emotePath"
        :style="`width: ${$props.emoteSize || '20px'}; height: ${$props.emoteSize ||'20px'}`"
      >
      <div
        :class="`inner-profile-picture ${$props.hover ? 'hoverable' : ''}`"
        :style="`${status || status === 0 ? 'border: solid 3px ' + statusColor.statusColor : ''}; height: ${$props.size}; width: ${$props.size}; background-image: url(${$props.url})`"
      />
    </div>
  </div>
</template>

<script>
import statuses from '@/utils/statuses';
export default {
  props: ["url", "size", "emoteSize", "admin", "hover", "animationPadding", "status", "uniqueID"],
  data() {
    return {
      crown: require("twemoji/2/svg/1f451.svg"),
      flower: require("twemoji/2/svg/1f33a.svg"),
      heart: require("twemoji/2/svg/2764.svg"),
    };
  },
  computed: {
    adminType() {
      if (this.$props.admin == 3)
        return {
          name: "creator",
          emotePath: this.crown
        };
      if (this.$props.admin == 4)
        return {
          name: "cute",
          emotePath: this.flower
        };
      if (this.$props.admin == 5)
        return {
          name: "supporter",
          emotePath: this.heart
        };
      return ""
    },
    statusColor() {
      let status = this.status;
      return {
        statusName: statuses[parseInt(status)].name,
        statusURL: statuses[parseInt(status)].url,
        statusColor: statuses[parseInt(status)].color,
        bgColor: statuses[parseInt(status)].bgColor
      }
    }
  }
};
</script>


<style scoped>
.outer-profile-picture{
  z-index: 999;
  user-select: none;
}
.profile-picture {
  position: relative;
  border-radius: 50%;
  flex-shrink: 0;
}
.inner-profile-picture {
  background-color: rgba(0, 0, 0, 0.315);
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  transition: 0.2s;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(0) scale(1, 1);
  transform: translateZ(0);
}
.hoverable:hover {
  filter: brightness(80%);
}
.creator {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: #ffd828 100%;
}

.supporter {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: #ff2828 100%;
}

.supporter .emote {
  z-index: 999;
  top: -3px;
  left: -3px;
}
.supporter .emote:after {
  z-index: 999;
}

.cute {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: #ffb7ed;
}

.cute .emote {
  z-index: 999;
  top: -3px;
  left: -3px;
}

.emote {
  position: absolute;
  height: 20px;
  width: 20px;
  transform: rotate(-40deg);
  top: -6px;
  left: -6px;
  z-index: -1;
}
</style>
