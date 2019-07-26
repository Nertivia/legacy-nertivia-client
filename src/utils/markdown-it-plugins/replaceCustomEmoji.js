import config from "@/config.js";

/* 58: ':' */
/* 60: '<' */
/* 62: '>' */

function render_custom_emoji(tokens, idx) {
	return ':3'
}

function parseUntil(state, fromPos, until) {
	let max = state.posMax
	let found = false

	let oldPos = state.pos
	// let start = nameStart + 1
	state.pos = fromPos
	let end = -1

	while(state.pos++ < max) {
		let marker = state.src.charCodeAt(state.pos)
		if(marker === until) {
			found = true;
			break;
		}
	}

	if(found) {
		end = state.pos
	}

	state.pos = oldPos

	return end
}

function parseEmojiName(state, nameStart) {
	return parseUntil(state, nameStart, 58)
}

function replace_custom_emoji(state, silent) {
	let pos = state.pos
	let max = state.posMax

	// if begins with <
	if (state.src.charCodeAt(pos) !== 60) { return false; }
	pos += 1

	// if the next character is not ':' then it's not a custom emoji
	if(state.src.charCodeAt(pos) !== 58) { return false; }

	// parse the emoji name
	let nameStart = pos + 1
	let nameEnd = parseEmojiName(state, nameStart)

	// parser failed to find another ':', so it's not a valid emoji
	if(nameEnd < 0 || nameEnd - nameStart <= 1) { return false; }

	let emojiName = state.src.slice(nameStart, nameEnd)
	
	pos = nameEnd + 1

	// parse until '>'
	let idStart = pos
	let idEnd = parseUntil(state, idStart, 62)

	if(idEnd < 0 || idEnd - idStart <= 1) { return false; }

	let emojiID = state.src.slice(idStart, idEnd)

	if(!silent) {
		state.pos = idStart
		state.posMax = idEnd

		let token = state.push('custom_emoji_open', 'img', 1);
		token.attrs = [[ 'src', `${config.domain}/files/${emojiID}` ]]

		// state.md.inline.tokenize(state)
	}

	state.pos = idEnd + 1
	state.posMax = max
	return true
}
export default function custom_emoji_plugin(md, opts) {
	md.renderer.rules.custom_emoji_open = (tokens, idx) => { 
		let token = tokens[idx]
		return `<${md.utils.escapeHtml(token.tag)} class="emoji" src=${md.utils.escapeHtml(token.attrs.find(([name]) => name === 'src')[1])} />` 
	}

	md.inline.ruler.push('custom_emoji', replace_custom_emoji)
}