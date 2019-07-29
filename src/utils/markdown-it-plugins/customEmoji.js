import config from "@/config.js";

/* 58: ':' */
/* 60: '<' */
/* 62: '>' */
/* example: '<:cat_1:1hvDmIdozFp2vTTkEIsO-wBHPaYRkGmlP>' */

function skipUntil(state, pos, code) {
  for (let max = state.src.length; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === code) { break; }
  }
  return pos;
}

// old
function parseUntil(state, fromPos, until, maxLength = 16) {
	let max = state.posMax
	let found = false
	let pos = state.pos + fromPos
	let oldPos = state.pos
	let end = -1


	while(pos < max &&  pos - oldPos < maxLength) {
		let marker = state.src.charCodeAt(pos)
		if(marker === until) {
			found = true;
			break;
		}

		// state.md.inline.skipToken(state);

		pos += 1
	}

	if(found) {
		end = pos
	}

	return end
}

function render_custom_emoji(tokens, idx) {
	return ''
}


function parseEmojiName(state, nameStart) {
	// return parseUntil(state, nameStart, 58)

	return skipUntil(state, nameStart, 58)
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

	// console.log(nameEnd, parseUntil(state,nameStart,58))

	// parser failed to find another ':', so it's not a valid emoji
	if(nameEnd > max || nameEnd < 0 || nameEnd - nameStart <= 1) { return false; }

	let emojiName = state.src.slice(nameStart, nameEnd)
	
	pos = nameEnd + 1

	// parse until '>'
	let idStart = pos
	let idEnd = skipUntil(state, pos, 62);

	if(idEnd > max || idEnd < 0 || idEnd - idStart <= 1) { return false; }

	let emojiID = state.src.slice(idStart, idEnd)

	if(!silent) {
		state.pos = idStart
		state.posMax = idEnd

		let token = state.push('custom_emoji', 'img', 0);
		token.attrs = [[ 'src', `${config.domain}/media/${emojiID}` ], [ 'alt', emojiName ]]
	}

	state.pos = idEnd + 1
	state.posMax = max
	return true
}

export default function custom_emoji_plugin(md, opts) {
	md.renderer.rules.custom_emoji = (tokens, idx) => { 
		let token = tokens[idx]

		// todo: better escaping method,
		// 			 even if this is good and covers most cases, there may be edge cases where DOMPurify may be better
		let src = md.utils.escapeHtml(token.attrs.find(([name]) => name === 'src')[1])
		let alt = md.utils.escapeHtml(token.attrs.find(([name]) => name === 'alt')[1])

		return `<${md.utils.escapeHtml(token.tag)} class="emoji" title=${alt} alt=${alt} src=${src} />` 
	}

	md.inline.ruler.push('custom_emoji', replace_custom_emoji)
}