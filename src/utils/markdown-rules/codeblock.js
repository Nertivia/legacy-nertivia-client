import * as SimpleMarkdown from 'simple-markdown'

export default (order) => { return {
	order: order++,
	match: function(source) {
		return /^ *```(?:(\S+) *)?\n?((?:[^`])+)```/.exec(source)
	},

	parse: function(capture, parse, state) {
		return {
			lang: capture[1] || undefined,
			content: capture[2]
		}
	},

	html: function(node, output) {
		const className = node.lang ? `language-${node.lang}` : undefined

		const codeblock = SimpleMarkdown.htmlTag("div", SimpleMarkdown.sanitizeText(node.content), {
			class: "codeblock"
		})

		const code = SimpleMarkdown.htmlTag("code", codeblock, {
			class: className
		})

		return SimpleMarkdown.htmlTag("pre", code)
	}
}}