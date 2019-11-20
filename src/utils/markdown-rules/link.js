import * as SimpleMarkdown from 'simple-markdown'
import LinkifyIt from 'linkify-it'

const linkify = LinkifyIt()

export default (order) => { return {
	order: order++,
	match: function(source) {
		const match = linkify.match(source)

		if(
			match === null || 
			match[0].index !== 0 ||
			match.length === 0
		) {
			return null
		}

		const converted = [
			match[0].raw,
			match[0].text,
			match[0].url,
		]

		return converted
	},

	parse: function(capture, parse, state) {
		return {
			content: {
				type: 'text',
				content: capture[1]
			},
			url: capture[2]
		}
	},

	html: function(node, output) {
		return SimpleMarkdown.htmlTag("a", output(node.content), {
			href: SimpleMarkdown.sanitizeText(SimpleMarkdown.sanitizeUrl(node.url)),
			class: "link",
			target: "_blank"
		})
	}
}}