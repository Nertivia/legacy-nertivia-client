<template>
  <div
    class="embed"
    ref="embed"
    :class="{
      article: embed.type === 'article' || embed.type === 'video.other',
      website: embed.type === 'website',
      youtubeEmbed: youtubeLink
    }"
  >
    <div class="right">
      <div
        class="image"
        @contextmenu="imageContextEvent"
        v-if="imageURL"
        @click="embedImgClicked"
      >
        <div class="play-icon material-icons" v-if="!playVideo && youtubeLink">
          play_arrow
        </div>
        <img
          v-if="!playVideo"
          ref="image"
          :src="`//proxi.bree.workers.dev/cdn/${encodeURIComponent(imageURL)}`"
          alt
        />
        <iframe
          v-if="playVideo"
          class="video"
          ref="video"
          width="100%"
          height="100%"
          :src="
            `https://www.youtube-nocookie.com/embed/${youtubeLink}?autoplay=1&vq=hd360`
          "
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
    <div class="left">
      <div class="title" v-if="embed.url">
        <a target="”_blank”" :href="embed.url">{{ embed.title }}</a>
      </div>
      <div class="title" v-else>{{ embed.title }}</div>
      <div class="description">{{ embed.description }}</div>
    </div>
  </div>
</template>

<script>
import windowProperties from "@/utils/windowProperties";
import isElectron from "../../utils/ElectronJS/isElectron";

export default {
  props: ["embed"],
  data() {
    return {
      playVideo: false
    };
  },
  methods: {
    youtube_parser(url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    },
    embedImgClicked() {
      if (this.youtubeLink) {
        this.playVideo = true;
        this.$nextTick(() => {
          this.resizeImage();
        });
        return;
      }
      this.$store.dispatch(
        "setImagePreviewURL",
        `https://proxi.bree.workers.dev/cdn/${encodeURIComponent(
          this.imageURL
        )}`
      );
    },
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    },
    resizeImage() {
      let size;
      if (this.youtubeLink) {
        size = 500;
      } else {
        size = 200;
      }
      const image = this.embed.image;
      if (!image || !image.dimensions) return undefined;

      if (this.embed.type !== "article" && this.embed.type !== "video.other")
        return undefined;

      const messageLog = document.querySelector(".message-logs");
      const w = messageLog.offsetWidth;
      const h = messageLog.offsetHeight;

      const minWidth = this.clamp(w / 2, 0, size);
      const minHeight = h / 2;

      const dimensions = image.dimensions;
      const srcWidth = dimensions.width;
      const srcHeight = dimensions.height;

      const newDimentions = this.calculateAspectRatioFit(
        srcWidth,
        srcHeight,
        minWidth,
        minHeight
      );

      const imageTag = this.$refs["image"] || this.$refs["video"];

      //embed.style.width = this.clamp(newDimentions.width, 0, srcWidth) + "px"

      imageTag.style.width =
        this.clamp(newDimentions.width, 0, srcWidth) + "px";
      imageTag.style.height =
        this.clamp(newDimentions.height, 0, srcHeight) + "px";
    },
    onResize() {
      this.resizeImage();
    },
    imageContextEvent(event) {
      if (isElectron) {
        event.preventDefault(true);
      } else {
        return;
      }
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "IMAGE_CONTEXT",
        url: `https://proxi.bree.workers.dev/cdn/${encodeURIComponent(
          this.imageURL
        )}`,
        x: event.clientX,
        y: event.clientY
      });
    }
  },
  mounted() {
    this.resizeImage();
  },
  watch: {
    getWindowWidth(dimensions) {
      this.onResize(dimensions);
    }
  },
  computed: {
    youtubeLink() {
      if (
        this.embed.url &&
        this.embed.url.startsWith("https://www.youtube.com/watch")
      ) {
        return this.youtube_parser(this.embed.url);
      }
      return false;
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    imageURL() {
      const image = this.embed.image;
      if (!image) return undefined;
      if (typeof image === "string") return undefined;
      if (image.url) return image.url;
      return undefined;
    }
  }
};
</script>

<style scoped lang="scss">
.embed {
  background: #ffffff21;
  padding: 5px;
  display: flex;
  max-width: 500px;
  align-self: flex-start;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.play-icon {
  color: rgba(255, 255, 255, 0.7);
  z-index: 9999999;
  position: absolute;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  font-size: 50px;
  transition: 0.3s;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 4px;
}
.embed.website {
  height: 100px;
}
.embed.website .image {
  display: flex;
  justify-content: center;
  width: 100px;
  height: 100px;
  overflow: hidden;
}
.embed.article .image {
  margin-right: 0;
}
.article .left {
  margin-left: 5px;
}
.article .right {
  flex-direction: column;
}
.article .image img {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  align-self: center;
}
.youtubeEmbed {
  flex-direction: column;
  .video {
    height: 100%;
    width: 100%;
    z-index: 9999999;
  }
  .image:after {
    background: rgba(0, 0, 0, 0);
  }
  &:hover .play-icon {
    color: white;
  }
  .image:hover:after {
    background: rgba(0, 0, 0, 0);
  }
}
.right {
  display: flex;
}

.title {
  font-size: 15px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.description {
  font-size: 14px;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.image img {
  width: auto;
  height: 100px;
  align-self: center;
}
.image {
  display: flex;
  margin-right: 10px;
  align-self: center;
  cursor: pointer;
  position: relative;
}
.image:after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  transition: 0.3s;
}
.image:hover:after {
  background: rgba(0, 0, 0, 0.384);
}
a {
  color: rgb(86, 159, 253);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

@media (max-width: 955px) {
  .article {
    flex-direction: column;
  }
}
</style>
