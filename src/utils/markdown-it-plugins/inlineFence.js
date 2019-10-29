function parseInlineFence(state, silent) {
  let pos = state.pos
  let max = state.posMax
  let src = state.src.slice(pos, max)

  if(pos + 6 > max || state.src.charCodeAt(pos) !== 0x60) {
    return false
  }


  if(!src.startsWith('```') || !src.endsWith('```')) {
    return false
  }

  pos += 3

  const marker = state.src.slice(state.pos, pos);

  let matchEnd = pos
  let matchStart = pos
  while ((matchStart = state.src.indexOf('```', matchEnd)) !== -1) {
    console.log(matchStart, state)
    matchEnd = matchStart + 1

    if(!silent) {
      const token = state.push('fence', 'code', 0)
      token.markup = marker
      token.content = state.src.slice(pos, matchStart)
        .replace(/\n/g, ' ')
        .replace(/^ (.+) $/, '$1');
    }
    state.pos = matchEnd + 2
    return true
  }

  if(!silent) {
    state.pending += marker
  }
  state.pos += 3
  return true
}
export default function inlineFence(md, opts) {
  md.inline.ruler.before('backticks', 'inline_fence', parseInlineFence)
}