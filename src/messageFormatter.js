import futoji from 'futoji'
import twemoji from 'twemoji'


export default (message) => {


	message = twemoji.parse(escapeHtml(message),
		function (icon, options, variant) {
			if (!icon) return message;
			return require("twemoji/2/svg/" + icon + ".svg")
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
		transformer: text => `<div class="codeblock"><code>${formatCode(text.trim())}</code></div>`,
	})

	futoji.addTransformer({
		name: 'code',
		symbol: '`',
		recursive: false,
		transformer: text => `<code>${text}</code>`,
	})
	return futoji.format(message);
}

/**
 * format code to add syntax highlighting
 */
function formatCode(text) {
	// matches if word until newline
	// if spaces then it won't match
	let nameRegex = new RegExp('^(\\w+)\\n')

	if (nameRegex.test(text)) {
		let language = nameRegex.exec(text)[1]
		let newText = text.replace(nameRegex, '')

		// TODO: format newText with language

		return newText
	}

	return text
}

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}