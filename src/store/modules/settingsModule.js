import Vue from 'vue'
import {
	bus
} from '../../main'



const state = {
	GDriveLinked: false,
	customEmojis: [],
	recentEmojis: JSON.parse(localStorage.getItem('recentEmojis')) || [],
	apperance: {}
}

const getters = {
	settings(state) {
		return state;
	},
	recentEmojis() {
		return state.recentEmojis || JSON.parse(localStorage.getItem('recentEmojis'))
	}
}

const actions = {
	setSettings(context, settings) {
		context.commit('setSettings', settings)
	},
	setGDriveLinked(context, status) {
		context.commit('GoogleDriveLinked', status)
	},
	addRecentEmoji(context, shortcode) {
		const recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

		let filter = recentEmojis.filter(function (item) {
			return item !== shortcode
		})

		filter.unshift(shortcode);
		filter = filter.slice(0, 16)
	
		localStorage.setItem("recentEmojis", JSON.stringify(filter));
		context.commit('setRecentEmojis', filter)
	},
	
	addCustomEmoji(context, customEmoji){
		context.commit('addCustomEmoji', customEmoji)
	},
	removeCustomEmoji(context, customEmoji) {
		const emojiID = customEmoji.emoji.emojiID;
		const customEmojiList = context.state.customEmojis;

		for (let index = 0; index < customEmojiList.length; index++) {
			const element = customEmojiList[index];
			if (element.emojiID === emojiID){
				context.commit('removeCustomEmoji', index);
				break;
			}
		}
	},
	renameCustomEmoji(context, renamedEmoji){
		const customEmojiList = context.state.customEmojis;

		for (let index = 0; index < customEmojiList.length; index++) {
			const element = customEmojiList[index];
			if (element.emojiID === renamedEmoji.emoji.emojiID){
				context.commit('renameCustomEmoji', {emoji: renamedEmoji.emoji, index});
				break;
			}
		}
	},
	setCustomEmojis({commit}, customEmojis) {
		commit('setCustomEmojis', customEmojis)
	},
	setApperance({commit}, data) {
		commit('setApperance', data)
	}
}

const mutations = {
	setApperance(state, data) {
		const apperance = state.apperance || {};
		apperance[Object.keys(data)[0]] = data[Object.keys(data)[0]]
		state['apperance']  = apperance
	},
	setSettings(state, settings) {
		Vue.set(state, Object.assign(state, settings))
	},
	GoogleDriveLinked(state, status) {
		Vue.set(state, 'GDriveLinked', status)
	},
	addCustomEmoji(state, customEmoji) {
		const customEmojisList = state.customEmojis || [];
		customEmojisList.push(customEmoji.emoji)

		Vue.set(state, "customEmojis", customEmojisList)
	},
	removeCustomEmoji(state, index) {
		Vue.delete(state.customEmojis, index)
	},
	renameCustomEmoji(state, {emoji, index}) {
		Vue.set(state.customEmojis, index, emoji)
	},
	setRecentEmojis(state, newEmojiList) {
		Vue.set(state, 'recentEmojis', newEmojiList)
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}