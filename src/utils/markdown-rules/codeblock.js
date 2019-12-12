import * as SimpleMarkdown from "simple-markdown";
import hljs from "highlight.js";

export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^ *```(?:(\S+) *)?\n?((?:[^`])+)```/.exec(source);
    },

    parse: function(capture) {
      return {
        lang: capture[1] || undefined,
        content: capture[2]
      };
    },

    html: function(node) {
      const className = node.lang ? `language-${node.lang}` : undefined;

      let content = SimpleMarkdown.sanitizeText(node.content);
      if (node.lang && hljs.getLanguage(node.lang)) {
        content = hljs.highlight(node.lang, node.content, true).value;
      }

      const codeblock = SimpleMarkdown.htmlTag("div", content, {
        class: "codeblock"
      });

      const code = SimpleMarkdown.htmlTag("code", codeblock, {
        class: className
      });

      return SimpleMarkdown.htmlTag("pre", code);
    }
  };
};
