<template>
  <div class="theme-content">
    <div class="name" v-if="themeDetail">{{ themeDetail.name }}</div>
    <div class="name center" v-if="themeDetail === undefined">
      Getting Theme Details...
    </div>
    <div class="name center" v-if="themeDetail === null">Invalid Theme</div>
    <img
      class="avatar"
      v-if="themeDetail"
      :src="mediaDomain + themeDetail.screenshot"
      alt=""
    />
    <div class="info" v-if="themeDetail">
      <div
        class="button"
        @click="unapplyTheme"
        v-if="applied === themeDetail.id"
      >
        Unapply Theme
      </div>
      <div class="button" v-else @click="applyTheme">Apply Theme</div>
    </div>
  </div>
</template>

<script>
import config from "../../config";
const cssZip = () => import("@/utils/cssZip");
import exploreService from "../../services/exploreService";

export default {
  props: ["theme"],
  data() {
    return {
      mediaDomain: config.domain + "/media/",
      themeDetail: undefined,
      applied: false,
    };
  },
  methods: {
    async unapplyTheme() {
      this.applied = null;
      localStorage.removeItem("appliedThemeId");
      document.getElementById("theme").outerHTML = "";
    },
    async applyTheme() {
      console.log("owo");
      // get css
      const { ok, result } = await exploreService.applyTheme(
        this.themeDetail.id
      );
      if (ok) {
        const css = result.data.css;
        const id = result.data.id;
        // save to local storage.
        localStorage.setItem("appliedThemeId", id);

        const styleEl = document.createElement("style");
        styleEl.classList.add("theme-" + id);
        styleEl.id = "theme";
        cssZip().then((utils) => {
          styleEl.innerHTML = utils.unzip(css) || css;

          const currentStyle = document.getElementById("theme");
          if (currentStyle) {
            currentStyle.outerHTML = styleEl.outerHTML;
          } else {
            document.head.innerHTML += styleEl.outerHTML;
          }
          this.applied = id;
        });
      }
    },
  },
  async mounted() {
    const id = this.theme[1];
    this.applied = localStorage.getItem("appliedThemeId");
    const { ok, result } = await exploreService.getTheme(id, false);
    if (!ok) {
      this.themeDetail = null;
    } else {
      this.themeDetail = result.data;
    }
  },
};
</script>

<style scoped lang="scss">
.theme-content {
  display: flex;
  background: #ffffff21;
  padding: 10px;
  max-width: 300px;
  margin-top: 5px;
  width: 100%;
  height: 230px;
  align-items: center;
  align-content: center;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}
.name {
  align-self: flex-start;
  margin-bottom: 5px;
}

.theme-content .material-icons {
  font-size: 40px;
}
.avatar {
  height: 170px;
  width: 100%;
  object-fit: cover;
}
.info {
  margin-left: 10px;
  margin-top: 10px;
}
.button {
  background: rgba(0, 0, 0, 0.2);
  user-select: none;
  padding: 3px;
  display: block;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
  flex-shrink: 0;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
.center {
  margin: auto;
  align-self: center;
}
</style>
