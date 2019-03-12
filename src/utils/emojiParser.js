import emojis from "emojibase-data/en/compact.json";
import {
	groups
} from "emojibase-data/meta/groups.json";


export default {
	replaceShortcode: (message) => {
		const regex = /:([\w]+):/g;

		return message.replace(regex, (x) => {
			const emoji = emojiExists(x.replace(/[::]+/g, ''))
			if (emoji) return emoji.unicode
			return x
		});
	},

	searchEmoji: (shortCode) => {
		let array = []
		for (let index = 0; index < emojis.length; index++) {
			const element = emojis[index];
			for (let i = 0; i < element.shortcodes.length; i++) {
				const el2 = element.shortcodes[i];
				if (el2.includes(shortCode)) array.push(element);
				if (array.length >= 10) return array;
			}
		}
		return array;
	}
}

function emojiExists(shortCode) {
	for (let index = 0; index < emojis.length; index++) {
		const element = emojis[index];
		for (let i = 0; i < element.shortcodes.length; i++) {
			const el2 = element.shortcodes[i];
			if (el2 === shortCode) {
				return element
			}
		}
	}
}