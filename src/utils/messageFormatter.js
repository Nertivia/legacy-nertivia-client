import twemoji from "twemoji";
import emojiParser from "@/utils/emojiParser";
import config from "@/config.js";

import * as SimpleMarkdown from 'simple-markdown'
import { htmlTag as h } from 'simple-markdown'


import codeblock from './markdown-rules/codeblock'
import underline from './markdown-rules/underline'
import strikeout from './markdown-rules/strikeout'
import inlineCodeblock from './markdown-rules/inlineCodeblock'
import link from './markdown-rules/link'
import customEmoji from './markdown-rules/customEmoji'

let order = 0;  // order the below rules as declared below rather than by the original defaultRules order:

const rules = {
    inlineCodeblock: inlineCodeblock(order++),
    codeblock: codeblock(order++),
    underline: underline(order++),
    strikeout: strikeout(order++),
    link: link(order++),
    customEmoji: customEmoji(order++),

    strong: Object.assign({}, SimpleMarkdown.defaultRules.strong, {
        order: order++,
    }),

    em: Object.assign({}, SimpleMarkdown.defaultRules.em, {
        order: order++,
    }),

    inlineCode: Object.assign({}, SimpleMarkdown.defaultRules.inlineCode, {
        order: order++,
        html: function(node, parse, state) {
          return SimpleMarkdown.htmlTag("code", SimpleMarkdown.sanitizeText(node.content), {
            class: "inline-code"
          }) 
        }
    }),

    text: Object.assign({}, SimpleMarkdown.defaultRules.text, {
        order: order++,
    }),
};

const parse = SimpleMarkdown.parserFor(rules);
const output = SimpleMarkdown.outputFor(rules, 'html');
const markdownToHtml = function(source, state) {
  // if you don't have a paragraph rule, you probably want to default `state.inline` to true, to
  // indicate to the bold rule that it is parsing inline text:
  if (rules.paragraph == null) {
    state.inline = true;
  }

  const parsedContentTree = parse(source, state);
  return output(parsedContentTree, state);
};

export default message => {
  message = markdownToHtml(message || '', { inline: false })
  message = emojiParser.replaceEmojis(message);

  return message;
};
