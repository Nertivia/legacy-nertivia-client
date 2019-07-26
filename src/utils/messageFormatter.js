import Formatter from 'futoji'
import twemoji from 'twemoji'
import emojiParser from '@/utils/emojiParser';
import config from "@/config.js";

import customEmoji from './markdown-it-plugins/replaceCustomEmoji'

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
	.use(customEmoji);
	
const emojiFormatter = new Formatter();

emojiFormatter.addTransformer({
	name:'customEmoji2',
	symbol: ':',
	padding: false,
	recursive: false,
	validate: text => /.+?&(.+?)/.test(text),
	transformer: owo
})

function owo (text) {
	const split = text.split('&');
	if (!split || split.length <= 1) return `:${text}:`;
	const url = split[split.length - 1].slice(4);
	return `<img class="emoji" draggable="false" alt=":${split[0]}:" src="${config.domain + "/files/" + url}">`
}


export default (message) => {

	message = markdown.render(message).trim();

	message = emojiParser.replaceEmojis(message);

	return message;
}