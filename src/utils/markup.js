export const generateRegex = parts => {
  return RegExp(
    Object.entries(parts)
      .map(([type, pattern]) => `(?<${type}>${pattern.source})`)
      .join("|"),
    'g'
  )
};
  
export const MARKUP_PARTS = {
  bold: /\*\*([^*]+?)\*\*/,
  italic: /__([^_]+?)__/,
  strike: /~~([^~]+?)~~/,
  codeblock: /```(\S*?)\n([^]+?)\n?```/,
  code: /`([^~]+?)`/,
  link: /https?:\/\/\S+\.\S+/,
  escape: /\\[*_~`\\>]/,
  blockquote: /(?:^|\n)> (.+)/,
  custom: /{\|(.{0,6})\|([^]+?[^\\])}/,
};

const MARKUP_REGEX = generateRegex(MARKUP_PARTS);

export function *parseRichText(text, root = true) {
  const matches = text.matchAll(MARKUP_REGEX)
  let lastOffset = 0
  for(const match of matches) {
    const [type, value] = Object.entries(match.groups).find(([,v]) => v != null)
    const params = match.filter(m => m != null).slice(2)
    
    if(match.index > lastOffset) {
      yield {
        text: text.slice(lastOffset, match.index)
      }
    }
    
    yield transformEntity({
      type: type,
      text: value,
      params: params
    }, root)

    lastOffset = match.index + match[0].length
  }
  
  yield {
    text: text.slice(lastOffset)
  }
  
  return lastOffset
};


export function transformEntity (entity, root = true) {
  switch(entity.type) {
    case "bold":
    case "italic":
    case "strike": {
      entity.innerText = entity.params[0]
      entity.children = parseRichText(entity.innerText, false)
      return entity
    }
    case "blockquote": {
      if(!root) {
        return {
          text: ["> ", parseRichText(entity.params[0])]
        }
      }
      entity.innerText = entity.params[0]
      entity.children = parseRichText(entity.innerText, false)
      return entity
    }
    case "code": {
      entity.innerText = entity.params[0]
      entity.children = entity.innerText
      return entity
    }
    case "link": {
      try {
        new URL(entity.text)
      } catch (err) {
        // console.warn(err)
        return { text: entity.text }
      }
      entity.link = entity.text
      entity.children = entity.link
      return entity
    }
    case "codeblock": {
      entity.lang = entity.params[0]
      entity.code = entity.params[1]
      entity.children = entity.code
      return entity
    }
    case "escape": {
      entity.token = entity.params[0]
      return entity
    }
    case "custom": {
      entity.custom_type = entity.params[0]
      entity.expression = entity.params[1]
      return entity
    }
    default: {
      return entity
    }
  }
}

// do not use entity.params in here!
export function parseEntity(entity, entities) {
  switch(entity.type) {
    case "bold":
      return <b>{entity.children}</b>
    case "italic":
      return <i>{entity.children}</i>
    case "strike":
      return <s>{entity.children}</s> 
    case "code":
        return <code>{entity.children}</code>
    case "link":
        return <a href={entity.link}>{entity.children}</a>
    case "escape":
      return entity.token
    case "codeblock":
      return <pre class="code"><code class={`lang-{entity.lang}`}>{entity.children}</code></pre>
    case "blockquote":
      return <blockquote>{entity.children}</blockquote>
    case "custom":
      switch(entity.custom_type) {
        case "link": {
          const [url, text] = entity.expression.split("->").map((s) => s.trim());
          return parseEntity({ type: "link", text: text, link: url }, entities)
        }
        case "#":
          return <span style={({ color: entity.expression.trim() })}>{parseEntities(entities)}</span>
        default:
          // console.warn(`unhandled custom expression '{entity.custom_type}'`)
          return entity.text
      }
    default:
      if(entity.type) console.warn(`unhandled entity '{entity.type}'`)
      return entity.text
  }
}

export function parseEntities(entities) {
  const result = []
  for(let entity of entities) {
    result.push(parseEntity(entity, entities))
  }
  return result
}

export function parse(text) {
  const entities = parseRichText(text)
  console.log(parseEntities(entities))
  return parseEntities(entities)
}