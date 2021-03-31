<template>
  <div :key="avatar" class="outer-profile-picture">
    <div
      :class="`profile-picture ${admin && adminType ? adminType.name : ''}`"
      :style="{ padding: animationPadding || '3px' }"
    >
      <!-- :style="`padding: ${$props.animationPadding || '3px'}`" -->
      <img
        v-if="adminType"
        :title="adminType.name"
        class="emote"
        :src="adminType.emotePath"
        :style="
          `width: ${$props.emoteSize || '20px'}; height: ${$props.emoteSize ||
            '20px'}`
        "
      />

      <img
        v-if="src"
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
        :src="src + (hover || !isGif ? '' : '?type=webp')"
      />
      <div
        v-else
        class="inner-profile-picture default"
        :class="{ hoverable: $props.hover }"
        :style="{
          height: $props.size,
          backgroundColor: color,
          width: $props.size,
          border: `${
            statusColor === undefined
              ? undefined
              : 'solid 3px' + statusColor.statusColor
          }`
        }"
        :src="src + (hover || !isGif ? '' : '?type=webp')"
      />
    </div>
  </div>
</template>

<script>
import statuses from "@/utils/statuses";
import config from "@/config";
import seedColor from "seed-color";
import { containsPerm } from "../../utils/RolePermissions";
export default {
  props: [
    "avatar",
    "size",
    "emoteSize",
    "badges",
    "hover",
    "animationPadding",
    "status",
    "uniqueID",
    "url"
  ],
  data() {
    return {
      nertiviaCDN: config.nertiviaCDN
    };
  },
  methods: {
    bitwiseRemove(perms, flag) {
      return (perms &= ~flag);
    },
    bitwiseAdd(perms, flag) {
      return perms | flag;
    },
    bitwiseContains(perms, flag) {
      return perms & flag;
    }
  },
  computed: {
    color() {
      return !this.avatar ? seedColor(this.uniqueID).toHex() : undefined;
    },
    src() {
      if (!this.avatar && !this.url) {
        return undefined;
      }
      if (this.url) {
        return this.url;
      }
      return config.nertiviaCDN + this.avatar;
    },
    isGif() {
      if (!this.avatar) return undefined;
      return this.avatar.endsWith(".gif");
    },
    defaultImage() {
      // console.log(require("../../assets/logo.png"))
      return require("../../assets/transparentLogo.svg");
    },
    admin() {
      if (!this.badges) return null;

      const CREATOR = 1;
      const CUTE = 2;
      const DEVELOPER = 4;
      const SUPPORTER = 8;
      const IDEA_QUEEN = 16;
      const BUG_CATCHER = 32;
      const TRANSLATOR = 64;
      const CONTRIBUTOR = 128;

      if (this.bitwiseContains(this.badges, CREATOR)) return 3;
      if (this.bitwiseContains(this.badges, CUTE)) return 4;
      if (this.bitwiseContains(this.badges, SUPPORTER)) return 5;
      if (this.bitwiseContains(this.badges, DEVELOPER)) return 6;
      if (this.bitwiseContains(this.badges, BUG_CATCHER)) return 7;
      if (this.bitwiseContains(this.badges, TRANSLATOR)) return 8;
      if (this.bitwiseContains(this.badges, CONTRIBUTOR)) return 9;
      return null;
    },
    adminType() {
      if (this.admin == 3)
        return {
          name: "creator",
          emotePath: require("../../assets/twemoji/1f451.svg")
        };
      if (this.admin == 4)
        return {
          name: "cute",
          emotePath: require("../../assets/twemoji/1f33a.svg")
        };
      if (this.admin == 5)
        return {
          name: "supporter",
          emotePath: require("../../assets/twemoji/2764.svg")
        };
      if (this.admin == 6)
        return {
          name: "developer",
          emotePath: require("../../assets/twemoji/2728.svg")
        };
      if (this.admin == 7)
        return {
          name: "bug_catcher",
          emotePath: require("../../assets/twemoji/1f41b.svg")
        };
      if (this.admin == 8)
        return {
          name: "translator",
          emotePath: require("../../assets/twemoji/1f4dd.svg")
        };
      if (this.admin == 9)
        return {
          name: "contributor",
          emotePath: require("../../assets/twemoji/1f5a5.svg")
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
.default {
  background-image: url("../../assets/transparentLogoProfile.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
}
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

.bug_catcher {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: #e234eb 100%;
}
.bug_catcher .emote {
  z-index: 9999999;
  top: -3px;
  left: -3px;
}

.translator {
  background: #1fffb4 100%;
}
.contributor {
  background: #cf24ff 100%;
}
.translator .emote {
  z-index: 9999999;
  top: -3px;
  left: -3px;
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
