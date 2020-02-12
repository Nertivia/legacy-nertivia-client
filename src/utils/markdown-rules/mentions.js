import * as SimpleMarkdown from "simple-markdown";
import { store } from "@/store/index";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^<@([\d]+)>/.exec(source);
    },

    parse: function(capture) {
      return {
        id: capture[1],
        orig: capture[0]
      };
    },
    html: function(node) {
      const member = store.getters["members/members"][node.id];
      if (!member) return node.orig;
      return SimpleMarkdown.htmlTag("span", "@" + member.username, {
        class: "mention",
        id: "mention-" + member.uniqueID
      });
    }
  };
};
