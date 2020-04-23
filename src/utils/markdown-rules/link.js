import * as SimpleMarkdown from "simple-markdown";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^(^|\s)(https?:\/\/)?(([^.\s/<>]+\.)+[a-z]+(:(\d+))?(\/[^\s<>]*)?)/.exec(source);
    },

    parse: function(capture) {
      return {
        protocol: capture[2],
        url: capture[0]
      };
    },
    html: function(node) {
      const url = new URL(node.protocol ? node.url.trim() : 'https://' + node.url.trim());
      const tdl = url.hostname.split(".").pop();
      if (tdl.length >= 4 || tdl.length <=1) return node.url;
      return SimpleMarkdown.htmlTag("a",  node.protocol ? url.href: url.href.split("//").pop() , {
        href: SimpleMarkdown.sanitizeText(SimpleMarkdown.sanitizeUrl(url.href)),
        class: "link",
        target: "_blank"
      }) + " ";
    }
  };
};