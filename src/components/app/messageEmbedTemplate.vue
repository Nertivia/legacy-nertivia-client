<template>
  <div
    class="embed"
    ref="embed"
    :class="{article: embed.type === 'article' || embed.type === 'video.other', website: embed.type === 'website'}"
  >
    <div class="right">
      <div class="image" v-if="imageURL" @click="embedImgClicked">
        <img ref="image" :src="`//images.weserv.nl/?url=${imageURL }`" alt />
      </div>
    </div>
    <div class="left">
      <div class="title" v-if="embed.url">
        <a target="”_blank”" :href="embed.url">{{embed.title}}</a>
      </div>
      <div class="title" v-else>{{embed.title}}</div>
      <div class="description">{{embed.description}}</div>
    </div>
  </div>
</template>

<script>
import windowProperties from "@/utils/windowProperties";

export default {
  props: ["embed"],
  methods: {
    embedImgClicked() {
      this.$store.dispatch(
        "setImagePreviewURL",
        "//images.weserv.nl/?url=" + this.imageURL
      );
    },
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    },
    articleSize() {
      const image = this.embed.image;
      if (!image || !image.dimensions) return undefined;

      if (this.embed.type !== "article" && this.embed.type !== "video.other")
        return undefined;

      const embed = this.$refs["embed"];
      const messageLog = document.querySelector(".message-logs");
      const w = messageLog.offsetWidth;
      const h = messageLog.offsetHeight;

      const minWidth = this.clamp(w / 2, 0, 200);
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

      const imageTag = this.$refs["image"];

      //embed.style.width = this.clamp(newDimentions.width, 0, srcWidth) + "px"

      imageTag.style.width =
        this.clamp(newDimentions.width, 0, srcWidth) + "px";
      imageTag.style.height =
        this.clamp(newDimentions.height, 0, srcHeight) + "px";
    },
    onResize(dimensions) {
      this.articleSize();
    }
  },
  mounted() {
    this.articleSize();
  },
  watch: {
    getWindowWidth(dimensions) {
      this.onResize(dimensions);
    }
  },
  computed: {
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

<style scoped>
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

