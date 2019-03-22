import Vue from 'vue'
import {
	bus
} from '../../main'



const state = {
	settings: {
		recentEmojis: []
	}
}

const getters = {
	settings(state) {
		return state.settings;
	},
	recentEmojis() {
		return state.settings.recentEmojis || JSON.parse(localStorage.getItem('recentEmojis'))
	}
}

const actions = {
	setSettings(context, settings) {
		context.commit('setSettings', settings)
	},
	setGDriveLinked(context, status) {
		context.commit('GoogleDriveLinked', status)
	},
	setLastEmoji(context, shortcode) {
		const recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

		let filter = recentEmojis.filter(function (item) {
			return item !== shortcode
		})

		filter.unshift(shortcode);
		filter = filter.slice(0, 16)
	
		localStorage.setItem("recentEmojis", JSON.stringify(filter));
		context.commit('setLastEmoji', filter)
	}

}

const mutations = {
	setSettings(state, settings) {
		state.settings = settings;
	},
	GoogleDriveLinked(state, status) {
		Vue.set(state.settings, 'GDriveLinked', status)
	},
	setLastEmoji(state, newEmojiList) {
		Vue.set(state.settings, 'recentEmojis', newEmojiList)
	},
}

export default {
	namespace: true,
	state,
	getters,
	actions,
	mutations
}