import Vue from "vue";
import throttle from "lodash/throttle";

const WindowProperties = new Vue({
  data() {
    return {
      resizeWidth: 0,
      resizeHeight: 0,
      isfocused: document.hasFocus(),
    };
  },
  created() {
    this.resizeWidth = window.innerWidth;
    this.resizeHeight = window.innerHeight;

    this.debouncedResize = throttle(this.onResize, 70);
    window.addEventListener("resize", this.debouncedResize);
    window.addEventListener("focus", () => {
      this.isfocused = true;
    })
    window.addEventListener("blur", () => {
      this.isfocused = false
    })
  },
  methods: {
    onResize() {
      this.resizeWidth = window.innerWidth;
      this.resizeHeight = window.innerHeight;
    }
  }
});

export default WindowProperties;
