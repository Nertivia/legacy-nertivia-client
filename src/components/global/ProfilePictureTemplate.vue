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
        :style="
          `width: ${$props.emoteSize || '20px'}; height: ${$props.emoteSize ||
            '20px'}`
        "
      />

      <img
        class="inner-profile-picture"
        :class="{ hoverable: $props.hover }"
        :style="{
          height: $props.size,
          width: $props.size,
          border: `${
            statusColor === undefined
              ? undefined
              : 'solid 3px' + statusColor.statusColor
          }`
        }"
        :src="$props.url"
      />
    </div>
  </div>
</template>

<script>
import statuses from "@/utils/statuses";
export default {
  props: [
    "url",
    "size",
    "emoteSize",
    "admin",
    "hover",
    "animationPadding",
    "status",
    "uniqueID"
  ],
  data() {
    return {
      crown: require("../../assets/twemoji/1f451.svg"),
      flower: require("../../assets/twemoji/1f33a.svg"),
      heart: require("../../assets/twemoji/2764.svg"),
      developer: require("../../assets/twemoji/2728.svg")
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
      if (this.$props.admin == 6)
        return {
          name: "developer",
          emotePath: this.developer
        };
      return "";
    },
    statusColor() {
      let status = this.status;
      if (status === undefined) return undefined;
      return {
        statusName: statuses[parseInt(status)].name,
        statusURL: statuses[parseInt(status)].url,
        statusColor: statuses[parseInt(status)].color,
        bgColor: statuses[parseInt(status)].bgColor
      };
    }
  }
};
</script>

<style scoped>
.outer-profile-picture {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  object-fit: cover;
  display: flex;
  transition: 0.2s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(0) scale(1, 1);
  transform: translateZ(0);
}
.hoverable {
  cursor: pointer;
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

.developer {
  background: linear-gradient(30deg, #6853b9, rgba(254, 94, 189, 0.8));
}
.developer .emote {
  z-index: 999;
  top: -3px;
  left: -3px;
}

.emote {
  position: absolute;
  height: 20px;
  width: 20px;
  top: -6px;
  left: -6px;
  z-index: -1;
  opacity: 0;
}
.outer-profile-picture:hover .emote {
  animation-name: emote;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes emote {
  0% {
    opacity: 0;
    transform: rotate(-40deg);
  }
  100% {
    opacity: 1;
    transform: rotate(-40deg);
  }
}
</style>
