<template>
  <div class="custom-scroll" :style="{ height, width, background }">
    <div
      class="slot"
      :style="{ '--top': spacingTop, '--bottom': spacingBottom }"
      @scroll="onScroll"
      ref="content"
    >
      <slot />
    </div>
    <div
      v-if="showScroll"
      class="scroll-bar"
      :style="{
        marginTop: scrollbarTop,
        height: `calc(100% - ${scrollbarTop} - ${scrollbarBottom})`,
      }"
      ref="scrollBar"
      @wheel="onWheel"
      @pointerdown="scrollBarMouseDown"
    >
      <div class="handle" ref="handle" @pointerdown="mouseDownHandle"></div>
    </div>
  </div>
</template>

<script>
import windowProperties from "@/utils/windowProperties";
export default {
  name: "CustomScroller",
  props: {
    background: String,
    height: String,
    width: String,
    spacingTop: String,
    spacingBottom: String,
    scrollbarTop: String,
    scrollbarBottom: String,
  },
  data() {
    return {
      pos2: 0,
      pos4: 0,
      showScroll: false,
    };
  },
  updated() {
    this.showScroller();
    this.setHandleHeight();
    this.setHandlePosition();
  },
  mounted() {
    this.showScroller();
    this.setHandleHeight();
    this.setHandlePosition();
  },
  methods: {
    onWheel(e) {
      this.$refs.content.scrollBy({
        top: this.getDeltaFromEvent(e)[1],
      });
    },
    getDeltaFromEvent(e) {
      let deltaX = e.deltaX;
      let deltaY = -1 * e.deltaY;

      if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = (-1 * e.wheelDeltaX) / 6;
        deltaY = e.wheelDeltaY / 6;
      }

      if (e.deltaMode && e.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
      }

      if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
      }

      return [-deltaX, -deltaY];
    },
    scrollBarMouseDown(e) {
      if (e.target.classList && e.target.classList.contains("scroll-bar")) {
        this.trackClick(e);
      }
    },
    trackClick(e) {
      const content = this.$refs.content;
      const scrollBar = this.$refs.scrollBar;
      const handle = this.$refs.handle;

      const maxScroll = scrollBar.clientHeight;
      const currentScroll = (e.clientY - scrollBar.offsetTop ) - handle.clientHeight / 2 ;
      content.scroll({
        top:
          (currentScroll / maxScroll) *
          (content.scrollHeight - content.clientHeight),
        left: 0,
        behavior: "smooth",
      });
    },
    setHandleHeight() {
      if (!this.showScroll) return;
      const scrollBar = this.$refs.scrollBar;
      const handle = this.$refs.handle;
      const content = this.$refs.content;
      if (!scrollBar) return;

      const viewportHeight = scrollBar.clientHeight;
      const contentHeight = content.scrollHeight;

      const viewableRatio = viewportHeight / contentHeight;
      const handleHeight = viewportHeight * viewableRatio;

      if (handleHeight <= 20) {
        handle.style.height = "20px";
        return;
      }
      handle.style.height = handleHeight + "px";
    },
    mouseDownHandle(e) {
      e = e || window.event;
      e.preventDefault();
      this.pos4 = e.clientY;
      document.onpointerup = (e) => this.mouseUp(e);
      document.onpointermove = (e) => this.mouseMove(e);
    },
    mouseMove(e) {
      e = e || window.event;
      e.preventDefault();
      const scrollBar = this.$refs.scrollBar;
      const handle = this.$refs.handle;
      const offsetTop = handle.offsetTop;

      this.pos2 = this.pos4 - e.clientY;

      if (
        this.pos2 < 0 &&
        offsetTop + handle.clientHeight >= scrollBar.clientHeight
      ) {
        handle.style.top = scrollBar.clientHeight - handle.clientHeight + "px";
        return;
      }
      if (offsetTop <= 0 && this.pos2 > 0) {
        handle.style.top = 0;
        return;
      }
      this.pos4 = e.clientY;
      this.$refs.handle.style.top = offsetTop - this.pos2 + "px";

      // move viewport
      const content = this.$refs.content;

      const maxScroll = scrollBar.clientHeight - handle.clientHeight;
      const currentScroll = handle.offsetTop;

      content.scrollTop =
        (currentScroll / maxScroll) *
        (content.scrollHeight - content.clientHeight);
    },
    mouseUp() {
      document.onpointerup = null;
      document.onpointermove = null;
    },
    showScroller() {
      const content = this.$refs.content;
      if (content.scrollHeight <= content.clientHeight) {
        this.showScroll = false;
      } else {
        this.showScroll = true;
      }
    },
    setHandlePosition() {
      if (!this.showScroll) return;
      const handle = this.$refs.handle;
      const content = this.$refs.content;
      const scrollBar = this.$refs.scrollBar;
      if (!content) return;
      if (!handle) return;
      const maxScroll = content.scrollHeight - content.clientHeight;
      handle.style.top =
        (content.scrollTop / maxScroll) *
          (scrollBar.clientHeight - handle.clientHeight) +
        "px";
    },
    onScroll() {
      this.setHandlePosition();
    },
  },
  watch: {
    scrollbarBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.showScroller();
          this.setHandleHeight();
          this.setHandlePosition();
        }, 200);
      })
    },
    getWindowSize() {
      this.showScroller();
      this.setHandleHeight();
      this.setHandlePosition();
    },
  },
  computed: {
    getWindowSize() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.slot {
  --top: 50px;
  --bottom: 503px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-top: var(--top);
  width: 100%;
  &:after {
    // fix for firefox not adding padding-bottom
    content: "";
    display: block;
    padding-bottom: var(--bottom);
  }
}
.slot::-webkit-scrollbar {
  display: none;
}
.custom-scroll {
  color: white;
  display: flex;
  overflow: hidden;
}
.scroll-bar {
  height: 100%;
  width: 20px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  user-select: none;
  position: relative;
  height: calc(100% - 76px);
  margin-top: 50px;
  touch-action: none;
}
.handle {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.6);
  transition: background 0.2s;
  cursor: default;
  &:active {
    background: rgba(255, 255, 255, 0.8);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
  touch-action: none;
}
</style>
