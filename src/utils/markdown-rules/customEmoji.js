import * as SimpleMarkdown from "simple-markdown";
import config from "@/config.js";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^<(g?):([\w\d_-]+):([\w\d_-]+)>/.exec(source);
    },

    parse: function(capture) {
      return {
        gif: capture[1] === "g",
        name: capture[2],
        id: capture[3],
      };
    },
    html: function(node) {
      return SimpleMarkdown.htmlTag("img", "", {
        class: "emoji custom-emoji",
        title: node.name,
        src: `${config.nertiviaCDN}emojis/${node.id}.${node.gif ? 'gif' : 'png'}`,
        alt: node.name
      });
    }
  };
};
