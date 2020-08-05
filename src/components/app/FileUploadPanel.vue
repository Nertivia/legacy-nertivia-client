<template>
  <div class="upload-panel" :class="{ isImage: image, mobile }">
    <div class="content" v-if="!fileSizeExceeded">
      <div class="inner-content">
        <div class="preview">
          <div v-show="image" ref="preview-image" class="preview-image" />
          <div v-if="!image" class="file-icon material-icons">
            insert_drive_file
          </div>
        </div>
        <div class="details">
          <div class="file-name">{{ name }}</div>
          <div class="size">{{ size }}</div>

          <div
            v-if="image"
            class="checkbox"
            :class="{ selected: compress }"
            @click="toggleCompressButton"
          >
            <div class="box" />
            <div class="name">Compress Image</div>
          </div>

          <div class="upload-cdn" v-if="image">
            <div class="title">Upload to:</div>
            <div
              class="radio"
              :class="{ selected: !upload_cdn }"
              @click="upload_cdn = 0"
            >
              <div class="box" />
              <div class="text">
                Google Drive
              </div>
            </div>
            <div
              class="radio"
              :class="{ selected: upload_cdn }"
              @click="upload_cdn = 1"
            >
              <div class="box" />
              <div class="text">
                Nertivia CDN
              </div>
            </div>
          </div>
        </div>
        <div class="button material-icons" @click="close">close</div>
      </div>
    </div>
    <div class="exceed" v-else>
      <div class="message">File must be less than 50MB!</div>
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";
import filesize from "filesize";
import windowProperties from "@/utils/windowProperties";

export default {
  props: ["sendFileFunc"],
  data() {
    return {
      name: "",
      size: "",
      image: false,
      upload_cdn: 0, // 0: google drive, 1: CDN
      compress: 1,
      mobile: false,
      width: null
    };
  },
  methods: {
    close() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    },
    keyDownEvent(event) {
      if (event.keyCode !== 27) return; // 27 = escape
      this.close();
    },
    loadFileInfo(file) {
      const previewImage = this.$refs["preview-image"];
      const mimeType = file.type;
      if (mimeType.split("/")[0] === "image") {
        this.upload_cdn = 1;
        this.image = true;
        const reader = new FileReader();
        reader.onloadend = function() {
          previewImage.style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
      }
    },
    toggleCompressButton() {
      const maxCDNSize = 7340000;
      if (
        this.upload_cdn === 1 &&
        this.compress === 1 &&
        this.fileToUpload.size > maxCDNSize
      ) {
        alert(
          "Nertivia CDN Max file size: 7MB. \nEither compress the image or upload using Google Drive option."
        );
        return;
      }
      this.compress ? (this.compress = 0) : (this.compress = 1);
    },
    windowWidthChange(newVal, oldVal) {
      const logsWidth = this.$el.parentElement.clientWidth;
      const panelWidth = this.width + 50;
      if (logsWidth < panelWidth) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    },
    mount() {
      this.mobile = false;
      this.$nextTick(() => {
        this.width = this.$el.offsetWidth;
        this.windowWidthChange();
      });

      this.image = false;
      this.upload_cdn = 0;
      this.compress = 1;
      this.name = this.fileToUpload.name;
      this.size = filesize(this.fileToUpload.size);
      this.loadFileInfo(this.fileToUpload);
    }
  },
  watch: {
    image() {
      this.$emit("change", { image: this.image });
    },
    compress() {
      this.$emit("change", { compress: this.compress });
    },
    upload_cdn() {
      this.$emit("change", { upload_cdn: this.upload_cdn });
      const maxCDNSize = 7340000;
      if (this.upload_cdn === 1 && this.fileToUpload.size > maxCDNSize) {
        this.compress = 1;
      }
    },
    fileToUpload() {
      this.mount();
    },
    windowWidth(newVal, oldVal) {
      this.windowWidthChange(newVal, oldVal);
    }
  },
  mounted() {
    this.$emit("change", {
      image: this.image,
      compress: this.compress,
      upload_cdn: this.upload_cdn
    });
    this.mount();
  },
  created() {
    document.addEventListener("keydown", this.keyDownEvent);
  },
  destroyed() {
    this.$store.dispatch("setEditMessage", null);
    document.removeEventListener("keydown", this.keyDownEvent);
  },
  computed: {
    windowWidth() {
      return windowProperties.resizeWidth;
    },
    fileSizeExceeded() {
      const maxSize = 52424000; //50MB
      return this.fileToUpload.size > maxSize;
    },
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    },
    fileToUpload() {
      return this.$store.getters.popouts.fileToUpload;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.upload-panel {
  padding: 10px;
  color: white;
  background: #3a4750f8;
  user-select: none;
  z-index: 1;
  margin-bottom: 0;
  position: absolute;
  left: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 black;
  margin-right: 30px;
  height: 70px;
  top: -100px;
  padding-right: 40px;
  &.isImage {
    overflow: auto;
    overflow-x: hidden;
    height: 165px;
    top: -200px;
    .inner-content {
      margin-bottom: 0;
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
}
.top {
  display: flex;
}
.title {
  flex: 1;
}
.inner-content {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.details {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  overflow: hidden;
}
.size {
  opacity: 0.7;
}
.details .file-name {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.preview {
  display: flex;
  .file-icon {
    font-size: 50px;
  }
}

.preview-image {
  background-color: rgba(0, 0, 0, 0.3);
  height: 150px;
  width: 270px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 4px;
  flex-shrink: 0;
  margin: auto;
}

.upload-cdn {
  color: white;
  margin-top: 10px;
  font-size: 14px;
  .radio {
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-content: center;
    align-items: center;
    height: 30px;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    .notice {
      font-size: 14px;
      opacity: 0.8;
    }
    .box {
      flex-shrink: 0;
      height: 20px;
      width: 20px;
      background: rgba(255, 255, 255, 0.4);
      margin-right: 5px;
      border-radius: 50%;
      transition: 0.2s;
      flex-shrink: 0;
    }
    &:hover .box {
      background: rgba(255, 255, 255, 0.8);
    }
    &:hover {
      color: white;
    }
    &.selected {
      .box {
        background: white;
      }
      color: white;
    }
  }
}
.checkbox {
  display: flex;
  margin-top: 5px;
  transition: 0.2s;
  opacity: 0.7;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  &:hover {
    .box {
      background: rgba(255, 255, 255, 0.6);
    }
    opacity: 1;
  }
  &.selected {
    .box {
      background: white;
    }
    opacity: 1;
  }

  .box {
    flex-shrink: 0;
    height: 20px;
    width: 20px;
    margin-right: 5px;
    transition: 0.2s;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
  }
}

.button {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
.mobile {
  left: 5px;
  right: 0;
  &.isImage {
    height: 290px !important;
    top: -330px !important;
    .inner-content {
      flex-direction: column;
    }
  }

  .preview-image {
    height: 120px;
    width: 210px;
  }
}
.exceed {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  padding-left: 15px;
}
</style>
