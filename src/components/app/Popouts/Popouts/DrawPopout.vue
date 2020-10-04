<template>
  <div class="inner" :class="{ fullscreen }">
    <div class="tool-bar">
      <div class="button material-icons" :title="$t('undo')" @click="undo">undo</div>
      <div class="button material-icons" :title="$t('redo')" @click="redo">redo</div>
      <input
        style="display: none;"
        type="color"
        ref="colorInput"
        @change="customColorChange"
      />
      <div class="colors">
        <div
          class="color"
          v-for="(color, index) in colors"
          :key="color"
          @click="colorChange($event, index)"
          :title="$t('pen-color')"
          :style="{ background: color }"
          :class="{ selected: selectedColor === index }"
        />
        <div
          class="color picker"
          @click="colorPickerClicked"
          :title="$t('custom-color')"
          :class="{ selected: selectedColor === null }"
        >
          <div class="icon material-icons" :style="{ color: customColor }">
            palette
          </div>
        </div>
      </div>

      <div class="pen-sizes">
        <div
          class="pen-size"
          v-for="(size, index) in penSize"
          :key="size"
          @click="changePenSize(size, index)"
          :title="$t('pen-size')"
          :class="{ selected: selectedPenSize === index }"
        >
          <div
            class="pen-size-inner"
            :style="{ width: `${size}px`, height: `${size}px` }"
          ></div>
        </div>
      </div>
    </div>
    <div class="canvas-container" ref="canvasContainer">
      <canvas class="canvas" ref="canvas" />
    </div>
    <div class="bottom-tool-bar">
      <div class="button material-icons" :title="$t('close')" @click="closeMenu">
        close
      </div>
      <div
        class="button material-icons"
        :title="$t('fullscreen')"
        @click="fullscreen = !fullscreen"
      >
        fullscreen
      </div>
      <div
        class="button material-icons"
        :class="{ confirm: deleteConfirm }"
        :title="$t('delete')"
        @click="deleteButton"
      >
        delete
      </div>
      <div
        class="button material-icons"
        @click="sendButton"
        :title="currentChannelID ? this.$t('send') : this.$t('send-no-channel')"
        :class="{ disabled: !currentChannelID }"
      >
        send
      </div>
    </div>
  </div>
</template>

<script>
import windowProperties from "@/utils/windowProperties";
import DoodlePad from "doodlepad";
import { set, get } from "idb-keyval";

export default {
  data() {
    return {
      doodlePad: null,
      colors: ["#000000", "#ff0000", "#008000", "#0000ff"],
      selectedColor: 0,
      penSize: [4, 8, 12, 16, 20, 24],
      selectedPenSize: 0,
      customColor: null,
      fullscreen: false,
      deleteConfirm: false
    };
  },
  methods: {
    deleteButton() {
      if (!this.deleteConfirm) {
        this.deleteConfirm = true;
        return;
      }
      this.deleteConfirm = false;
      this.doodlePad.strokes = [];
      this.doodlePad.render();
    },
    sendButton() {
      if (!this.currentChannelID) return;
      if (!this.doodlePad.strokes.length) return;
      this.$refs.canvas.toBlob(blob => {
        let file = new File([blob], "drawing.png", {
          type: "image/png"
        });
        this.$store.dispatch("setFile", file);
        this.$store.dispatch("setPopoutVisibility", {
          name: "uploadDialog",
          visibility: true
        });
      }, "image/png");
    },
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null,
        unclosableType: null,
        messageID: null,
        channelID: null
      });
    },
    undo() {
      this.doodlePad.undo();
    },
    redo() {
      this.doodlePad.redo();
    },
    colorChange(event, index) {
      const color = this.colors[index];
      this.doodlePad.state.strokeColor = color;
      this.selectedColor = index;
    },
    changePenSize(size, index) {
      this.doodlePad.state.strokeWidth = size;
      this.selectedPenSize = index;
    },
    colorPickerClicked() {
      if (this.selectedColor != null && this.customColor != null) {
        this.doodlePad.state.strokeColor = this.customColor;
        this.selectedColor = null;
        return;
      }
      this.$refs.colorInput.click();
    },
    customColorChange(event) {
      this.selectedColor = null;
      this.customColor = event.target.value;
      this.doodlePad.state.strokeColor = event.target.value;
    },
    keydown(event) {
      if (event.ctrlKey) {
        if (event.keyCode === 90) {
          if (event.shiftKey) {
            this.redo();
            return;
          }
          this.undo();
        }
      }
    },
    setCanvasSize() {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      this.doodlePad.width = rect.width;
      this.doodlePad.height = rect.height;
      this.doodlePad.render();
    }
  },
  beforeDestroy() {
    set("drawing", this.doodlePad.strokes);
    document.removeEventListener("keydown", this.keydown);
    this.doodlePad.removeEventListeners();
  },
  watch: {
    fullscreen() {
      this.$nextTick(() => {
        this.setCanvasSize();
      });
    },
    getWindowSize() {
      this.setCanvasSize();
    }
  },
  computed: {
    getWindowSize() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    details() {
      return this.$store.getters.popouts.allPopout;
    },
    currentChannelID() {
      const currentTab = this.$store.getters.currentTab;
      if (currentTab === 1 || currentTab === 2) {
        return this.$store.getters.currentChannelID;
      }
      return undefined;
    }
  },
  mounted() {
    document.addEventListener("keydown", this.keydown);
    const canvas = this.$refs.canvas;
    const context = canvas.getContext("2d");

    this.doodlePad = new DoodlePad(context);
    this.$nextTick(() => {
      this.doodlePad.state.strokeSmoothness = 2;
      this.doodlePad.state.strokeWidth = 5;
      this.doodlePad.state.backgroundColor = "white";
      this.doodlePad.state.lowQuality = false;
      this.doodlePad.render();
      get("drawing").then(val => {
        if (!val) return;
        this.doodlePad.strokes = val;
        this.doodlePad.render();
      });
    });

    this.setCanvasSize();
  }
};
</script>

<style scoped lang="scss">
.inner {
  position: absolute;
  z-index: 999999;
  top: 50px;
  right: 50px;
  margin: auto;
  width: 600px;
  height: 500px;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 4px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  &.fullscreen {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.canvas-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.canvas {
  touch-action: none;
  overflow: hidden;
  cursor: crosshair;
  user-select: none;
  flex-shrink: 0;
  height: 100%;
  width: 100%;
}

.tool-bar {
  user-select: none;
  display: flex;
  flex-shrink: 0;
  .button {
    margin: 2px;
    padding: 1px;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.2s;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.2);
    }
  }
  .colors {
    display: flex;
    align-content: center;
    align-items: center;
    margin-left: 10px;
    .color {
      margin-left: 5px;
      flex-shrink: 0;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      border: solid 2px rgba(255, 255, 255, 0.6);
      transition: 0.2s;
      cursor: pointer;
      &:hover {
        border: solid 2px white;
      }
      &.selected {
        border: solid 2px white;
      }
    }
    .picker {
      border: none;
      height: 30px;
      width: 30px;
      display: flex;
      align-content: center;
      align-items: center;
      justify-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      .material-icons {
        align-content: center;
        align-items: center;
      }
      &.selected {
        border: none;
        color: white;
      }
      &:hover {
        border: none;
        color: white;
      }
    }
  }
  .pen-sizes {
    display: flex;
    align-content: center;
    align-items: center;
    margin-left: 10px;
    .pen-size {
      display: flex;
      align-content: center;
      align-items: center;
      justify-items: center;
      justify-content: center;
      margin-left: 5px;
      flex-shrink: 0;
      border-radius: 50%;
      height: 25px;
      width: 25px;
      transition: 0.2s;
      cursor: pointer;
      opacity: 0.6;
      .pen-size-inner {
        background: white;
        border-radius: 50%;
        align-self: center;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
      &.selected {
        opacity: 1;
      }
    }
  }
}
.bottom-tool-bar {
  display: flex;
  align-content: center;
  align-items: center;
  height: 30px;
  flex-shrink: 0;
  .button {
    opacity: 0.8;
    margin: auto;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    &:hover {
      opacity: 1;
    }
    &.disabled {
      color: rgba(255, 255, 255, 0.5);
    }
    &.disabled:hover {
      color: rgba(255, 255, 255, 0.5);
      cursor: default;
    }
    &.confirm {
      color: rgb(255, 64, 64);
    }
  }
}

@media (max-width: 600px) {
  .inner {
    width: 100%;
    left: 0;
    right: 0;
  }
}
@media (max-height: 550px) {
  .inner {
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
}
</style>
