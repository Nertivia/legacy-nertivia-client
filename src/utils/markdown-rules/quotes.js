import * as SimpleMarkdown from "simple-markdown";
import messageFormatter from '@/utils/messageFormatter';

export default order => {
  return {
    order: order++,
    match: function (source) {
      return /^<m([\d]+)>/.exec(source);
    },

    parse: function (capture, _, state) {
      return {
        quotes: state.content && state.content.quotes ? state.content.quotes : undefined,
        id: capture[1],
        orig: capture[0]
      };
    },
    html: function (node) {
      if (!node.quotes || !node.quotes.length) return SimpleMarkdown.sanitizeText(node.orig);
      const quote = node.quotes.find(q => q.messageID === node.id);
      if (!quote) return SimpleMarkdown.sanitizeText(node.orig);

      return SimpleMarkdown.htmlTag("div",
      SimpleMarkdown.htmlTag("div", 
      SimpleMarkdown.htmlTag("div", "Quoted: ")+ SimpleMarkdown.htmlTag("div", SimpleMarkdown.sanitizeText(quote.creator.username), {class: "quote-username", id: quote.creator.uniqueID})
      ,{class: "quote-profile"}) + 
      SimpleMarkdown.htmlTag("div", messageFormatter(quote.message), {class: "quote-message"}),
        { class: "quote" }
      );
    }
  };
};
