import * as SimpleMarkdown from "simple-markdown";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^(^|\s)((https?:\/\/)?[\w-]+(\.[a-z-]+)+\.?(:\d+)?(\/\S*)?)/.exec(source);
    },

    parse: function(capture) {
      return {
        protocol: capture[3],
        url: capture[2]
      };
    },
    html: function(node) {
      return SimpleMarkdown.htmlTag("a", node.url.trim(), {
        href: SimpleMarkdown.sanitizeText(SimpleMarkdown.sanitizeUrl(node.protocol ? node.url : 'https://' + node.url)),
        class: "link",
        target: "_blank"
      }) + " ";
    }
  };
};
