<script>
import { unzipAlt } from "@/utils/zip";
import Markup from "@/components/app/Markup.vue";
export default {
  props: ["embed"],
  methods: {
    clickEvent(e) {
      e.preventDefault();
      if (e.target.nodeName === "A") {
        const link = e.target.getAttribute("href");
        if (!link) return;
        this.$store.dispatch("setAllPopout", {
          show: true,
          type: "OPEN_LINK_CONFIRM",
          link: link
        });
      }
    },
    unescapeHtml(unsafe) {
      return unsafe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    },
    contentTemplate(json) {
      if (json.styles && json.styles.backgroundImage) {
        json.styles.backgroundImage = `url("https://proxi.bree.workers.dev/cdn/${ encodeURIComponent(json.styles.backgroundImage)}")`
      }

      const el = this.$createElement(json.tag, {style: json.styles});
      el.children = [];

      if (typeof json.content === "object") {
		      if (Array.isArray(json.content)) {
            for (let c = 0; c < json.content.length; c++) {
              const jsonContent = json.content[c];
              el.children.push(this.contentTemplate(jsonContent));
            }
            return el;
          } else {
              el.children.push(this.contentTemplate(json.content));
			        return el
          }
      }

      if (json.content) {
        el.children = [<Markup class='content' text={json.content} />];
      }

      return el
    },
  },
  render(ce) {
    const obj = JSON.parse(unzipAlt(this.embed));
    const content = this.contentTemplate(obj);
    return this.$createElement('div', { class: 'html-embed', on: {click: this.clickEvent}, }, [content]);
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
.html-embed {
  border-radius: 5px;
  background: $embed-bg-color;
  padding: 5px;
  display: flex;
  max-width: 500px;
  max-height: 500px;
  align-self: flex-start;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;

  font-size: 14px;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;

  flex-shrink: 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  position: relative;
}
</style>
<style>
.html-embed a {
  color: #68aaff;
}
</style>