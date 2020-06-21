import * as SimpleMarkdown from "simple-markdown";
import * as linkify from "linkifyjs";


const matchLink = str => {
  const tokens = linkify.tokenize(str);
  if (tokens.length >= 1 && tokens[0].isLink) {
    if (tokens[0].v[0].v === "/" && tokens[0].v[1].v === "/") return;
    return {
      ...tokens[0].toObject(),
      raw: tokens[0].toString()
    };
  }
};

export default order => {
  return {
    order: order++,
    match: function(source) {
      const trimmed = source.trimStart();
      const diff = source.length - trimmed.length;
      const space = source.slice(0, diff);

      const link = matchLink(trimmed);

      if(link === undefined || link.length === 0) {
        return null
      }

      return [
        source.slice(0, link.raw.length + diff),
        link,
        space
      ]
    },

    parse: function (capture) {
      return {
        content: {
          type: 'text',
          content: capture[0]
        },
        link: capture[1],
        space: capture[2]
      }
    },

    html: function ({ link, space }) {
      try {
        return (
          SimpleMarkdown.sanitizeText(space) +
          SimpleMarkdown.htmlTag(
            "a", 
            SimpleMarkdown.sanitizeText(`${link.raw}`),
            {
              href: SimpleMarkdown.sanitizeUrl(link.href),
              class: "link",
              target: "_blank"
            }
          ) + " "
        )
      } catch (err) {
        return link.href
      }
    }
  };
};