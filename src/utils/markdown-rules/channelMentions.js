import * as SimpleMarkdown from "simple-markdown";
import { store } from "@/store/index";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^<#([\d]+)>/.exec(source);
    },

    parse: function(capture) {
      return {
        id: capture[1],
        orig: capture[0]
      };
    },
    html: function(node) {
      const channel = store.getters.channels[node.id];
      if (!channel || !channel.server_id) return node.orig;
      return SimpleMarkdown.htmlTag(
        "span",
        "#" + SimpleMarkdown.sanitizeText(channel.name),
        {
          class: "mention channel",
          id: "mention-" + channel.channelID
        }
      );
    }
  };
};
