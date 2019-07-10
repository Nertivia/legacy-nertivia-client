import Formatter from 'futoji'
import twemoji from 'twemoji'
import emojiParser from '@/utils/emojiParser';
import config from "@/config.js";
import hljs from 'highlight.js'
import { escape as escapeHTML, unescape as unescapeHTML } from 'validator'

const futoji = new Formatter();
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

futoji.addTransformer({
	name: 'custom emoji',
	symbol: ':',
	padding: false,
	recursive: false,
	validate: text => /.+?&(.+?)/.test(text),
	transformer: text => {
		const formattedInner = emojiFormatter.format(text);
		return owo(formattedInner);

	}
})

futoji.addTransformer({
	name: 'url',
	open: 'http',
	close: ' ',
	recursive: false,
	validate: text => /(https?:\/\/[^\s]+)/g.test('http' + text),
	transformer: text => '<a class="msg-link" target="_blank" href="http' + text + '">http' + text + '</a> '
})

futoji.addTransformer({
	name: 'bold-and-italic',
	symbol: '***',
	transformer: text => `<strong><em>${text}</em></strong>`
})

futoji.addTransformer({
	name: 'bold',
	symbol: '**',
	transformer: text => `<strong>${text}</strong>`
})

futoji.addTransformer({
	name: 'italic',
	symbol: '*',
	transformer: text => `<em>${text}</em>`
})

futoji.addTransformer({
	name: 'underline',
	symbol: '__',
	transformer: text => `<u>${text}</u>`
})
futoji.addTransformer({
	name: 'italic',
	symbol: '_',
	transformer: text => `<em>${text}</em>`
})
futoji.addTransformer({
	name: 'srike',
	symbol: '~~',
	transformer: text => `<s>${text.trim()}</s>`
})

futoji.addTransformer({
	name: 'code-block',
	symbol: '```',
	recursive: false,
	transformer: text => {
		let formatted = formatCode(unescapeHTML(text))

		let highlighted
		if(formatted.lang in hljs.listLanguages()) {
			highlighted = hljs.highlight(formatted.lang, formatted.code, true)
		} else {
			highlighted = hljs.highlightAuto(formatted.code)
		}

		return `<div class="codeblock"><code lang="${highlighted.language}">${highlighted.value}</code></div>`
	}
})

futoji.addTransformer({
	name: 'code',
	symbol: '`',
	recursive: false,
	transformer: text => `<code>${text}</code>`,
})

export default (message) => {

	message = futoji.format(escapeHtml(message + ' ')).trim();

	message = emojiParser.replaceEmojis(message);

	return message;
}

/**
 * format code to get language and code
 */
function formatCode(text) {
	// matches if word until newline
	// if spaces then it won't match
	let nameRegex = new RegExp('^(\\w+)\\s')

	if (nameRegex.test(text)) {
		let language = nameRegex.exec(text)[1]
		let newText = text.replace(nameRegex, '')

		return {
			lang: language,
			code: newText
		}
	}

	return {
		lang: '',
		code: text
	}
}

// todo: replace with well tested / faster method
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}