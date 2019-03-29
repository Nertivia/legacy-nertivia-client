import twemoji from "twemoji";
import matchSorter from "match-sorter";
import emojis from "@/utils/emojiData/emojis.json";
import groups from "@/utils/emojiData/groups.json";
import config from "@/config.js";
import {
	store
} from '@/store/index';

export default {
	getCustomEmojisByShortCode(shortcode) {
		const customEmojis = store.state['settingsModule'].customEmojis;
		return customEmojis.find(emoji => emoji.name === shortcode)
	},
	replaceShortcode: (message) => {
		const customEmojis = store.state['settingsModule'].customEmojis;

		const regex = /:([\w]+):/g;

		return message.replace(regex, (x) => {
			const emoji = emojiExists(x.replace(/[::]+/g, ''))
			if (emoji) return emoji.unicode

			const customEmoji = customEmojis.find(e => e.name === x.substr(1).slice(0, -1))
			if (customEmoji) return `:${customEmoji.name}&${customEmoji.emojiID}:`
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
				emojiPath = require("twemoji/2/svg/" + icon + ".svg")
			})
		return emojiPath;
	},
	searchEmoji: (shortCode) => {
		const customEmojis = store.state['settingsModule'].customEmojis;
		return [...matchSorter(customEmojis, shortCode, {
			keys: ['name']
		}), ...matchSorter(emojis, shortCode, {
			keys: ['shortcodes']
		})];
	},
	allEmojis: emojis,
	allGroups: groups
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