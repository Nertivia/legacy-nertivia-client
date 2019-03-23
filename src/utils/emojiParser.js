import twemoji from "twemoji";
import matchSorter from "match-sorter";
import emojis from "@/utils/emojiData/emojis.json";
import groups from "@/utils/emojiData/groups.json";


export default {
	replaceShortcode: (message) => {
		const regex = /:([\w]+):/g;

		return message.replace(regex, (x) => {
			const emoji = emojiExists(x.replace(/[::]+/g, ''))
			if (emoji) return emoji.unicode
			return x
		});
	},
	replaceEmojis: (string) => {
		return twemoji.parse(string,
			function (icon, options, variant) {
				if (!icon) return string;
				return require("twemoji/2/svg/" + icon + ".svg")
			})
	},
	GetEmojiPath: (string) => {
		let emojiPath;
		twemoji.parse(string,
			function (icon, options, variant) {
				if (!icon) return string;
				emojiPath =  require("twemoji/2/svg/" + icon + ".svg")
			})
		return emojiPath;
	},
	searchEmoji: (shortCode) => {
		return matchSorter(emojis, shortCode, {keys: ['shortcodes']});
	},
	getAllEmojis: _ => emojis,
	getGroups: _ => groups
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