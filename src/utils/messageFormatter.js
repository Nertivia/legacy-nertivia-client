import twemoji from 'twemoji'
import emojiParser from '@/utils/emojiParser';
import config from "@/config.js";

import customEmoji from './markdown-it-plugins/customEmoji'
import formatLink from './markdown-it-plugins/formatLink'
import formatCode from './markdown-it-plugins/formatCode'

import hljs from 'highlight.js'

import MarkdownIt from 'markdown-it'
import chatPlugin from 'markdown-it-chat-formatter/dist-src/plugin'

const markdown = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<div class="codeblock"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></div>';
      } catch (err) {
				console.error(err)
      }
    }

    return '<div class="codeblock"><code>' + markdown.utils.escapeHtml(str) + '</code></div>';
  }
}).use(chatPlugin)
	.use(customEmoji)
  .use(formatLink)
  .use(formatCode);

export default (message) => {

	message = markdown.render(message).trim();

	message = emojiParser.replaceEmojis(message);

	return message;
}