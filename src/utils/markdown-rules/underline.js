import * as SimpleMarkdown from "simple-markdown";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^__([\s\S]+?)__(?!_)/.exec(source);
    },

    parse: function(capture, parse, state) {
      return {
        content: parse(capture[1], state)
      };
    },

    html: function(node, output) {
      return SimpleMarkdown.htmlTag("u", output(node.content), {
        class: "underline"
      });
    }
  };
};
