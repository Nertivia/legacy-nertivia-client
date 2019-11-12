import * as SimpleMarkdown from 'simple-markdown'

export default (order) => { return {
	order: order++,
	match: function(source) {
		return /^~~([\s\S]+?)~~(?!~)/.exec(source)
	},

	parse: function(capture, parse, state) {
		return {
			content: parse(capture[1], state)
		}
	},

	html: function(node, output) {
		return SimpleMarkdown.htmlTag("s", output(node.content))
	}
}}