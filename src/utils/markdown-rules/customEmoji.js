import * as SimpleMarkdown from 'simple-markdown'
import config from "@/config.js";

export default (order) => { return {
	order: order++,
	match: function(source) {
		return /^<:([\w\d_-]+):([\w\d_-]+)>/.exec(source)
	},

	parse: function(capture, parse, state) {
		return {
			name: capture[1],
			id: capture[2]
		}
	},
	html: function(node, output) {
		return SimpleMarkdown.htmlTag('img', '', {
			class: "emoji custom-emoji",
			title: node.name,
			src: `${config.domain}/media/${node.id}`,
			alt: node.name
		})
	}
}}