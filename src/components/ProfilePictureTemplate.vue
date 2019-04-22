<template>
  <div :class="`profile-picture ${adminType ? adminType.name : ''}`" :style="`padding: ${$props.animationPadding || '3px'}`">
    <img v-if="adminType" class="emote" :src="adminType.emotePath" :style="`width: ${$props.emoteSize || '20px'}; height: ${$props.emoteSize ||'20px'}`">
    <div
      :class="`inner-profile-picture ${$props.hover ? 'hoverable' : ''}`"
      :style="`height: ${$props.size}; width: ${$props.size}; background-image: url(${$props.url})`"
    ></div>
  </div>
</template>

<script>
export default {
  props: ["url", "size","emoteSize", "admin", "hover", 'animationPadding'],
  data() {
    return {
      crown: require("twemoji/2/svg/1f451.svg"),
      flower: require("twemoji/2/svg/1f33a.svg"),
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
    }
  }
};
</script>


<style scoped>
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
}
.hoverable:hover{
  filter: brightness(80%);
}
.creator {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: linear-gradient(
    45deg,
    #ffd828 1%,
    #ffd828 40%,
    #ffd828 50%,
    #ffe87f 60%,
    #ffd828 99%,
    #ffd828 100%,
    #ffd828 100%
  );
  background-size: 400% 400%;

  animation: Anime 4s ease infinite;
}
.cute {
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  margin: auto;
  background: linear-gradient(
    45deg,
    #ffb7ed 1%,
    #ffb7ed 40%,
    #ffb7ed 50%,
    #ffe2f8 60%,
    #ffb7ed 99%,
    #ffb7ed 100%,
    #ffb7ed 100%
  );
  background-size: 400% 400%;

  animation: Anime 4s ease infinite;
}
.cute .emote {
  z-index: 999;
  top: -3px;
  left: -3px;
}

@keyframes Anime {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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
