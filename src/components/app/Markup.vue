<script>
import { store } from "@/store/index";
import MemberMention from "./markup/MemberMention.vue";
import ChannelMention from "./markup/ChannelMention.vue";
import MessageQuote from "./markup/MessageQuote.vue";

const generateRegex = parts => {
  return RegExp(
    Object.entries(parts)
      .map(([type, pattern]) => `(?<${type}>${pattern.source})`)
      .join("|"),
    "g"
  );
};

const MARKUP_PARTS = {
  bold: /\*\*([^*]+?)\*\*/,
  italic: /__([^_]+?)__/,
  strike: /~~([^~]+?)~~/,
  inlineCodeblock: /```([^`]+?)```/,
  codeblock: /```(\S*?)\n([^]+?)\n?```/,
  code: /`([^~]+?)`/,
  link: /https?:\/\/\S+\.\S+/,
  escape: /\\[*_~`\\>]/,
  blockquote: /(?:^|\n)> ([^]+?)(?=(?:\n[^>])|$)/,
  userMention: /<@(\d+)>/,
  channelMention: /<#(\d+)>/,
  messageQuote: /<m(\d+)>/,
  custom: /{\|(.{0,6})\|([^]+?[^\\])}/,
  egg: /§([0-9a-fk-or])/
};

const MARKUP_REGEX = generateRegex(MARKUP_PARTS);

function* parseRichText(text, root = true) {
  const matches = text.matchAll(MARKUP_REGEX);
  let lastOffset = 0;
  for (const match of matches) {
    const [type, value] = Object.entries(match.groups).find(
      ([, v]) => v != null
    );
    const params = match.filter(m => m != null).slice(2);

    if (match.index > lastOffset) {
      yield {
        text: text.slice(lastOffset, match.index)
      };
    }

    yield transformEntity(
      {
        type: type,
        text: value,
        params: params
      },
      root
    );

    lastOffset = match.index + match[0].length;
  }

  yield {
    text: text.slice(lastOffset)
  };

  return lastOffset;
}

const eggs = {
  "§0": "#000000",
  "§1": "#0000AA",
  "§2": "#00AA00",
  "§3": "#00AAAA",
  "§4": "#AA0000",
  "§5": "#AA00AA",
  "§6": "#FFAA00",
  "§7": "#AAAAAA",
  "§8": "#555555",
  "§9": "#5555FF",
  "§a": "#55FF55",
  "§b": "#55FFFF",
  "§c": "#FF5555",
  "§d": "#FF55FF",
  "§e": "#FFFF55",
  "§f": "#FFFFFF"
};

function transformEntity(entity, root = true) {
  switch (entity.type) {
    case "bold":
    case "italic":
    case "strike": {
      entity.innerText = entity.params[0];
      entity.children = parseRichText(entity.innerText, false);
      return entity;
    }
    case "blockquote": {
      if (!root) {
        return {
          text: ["> ", parseRichText(entity.params[0], false)]
        };
      }
      // todo(@brecert): this isn't very performant or clean, please change
      entity.children = entity.params[0]
        .split("\n> ")
        .map(text => [parseRichText(text, false), "\n"]);
      return entity;
    }
    case "code": {
      entity.innerText = entity.params[0];
      entity.children = entity.innerText;
      return entity;
    }
    case "link": {
      try {
        new URL(entity.text);
      } catch (err) {
        console.warn(err);
        return { text: entity.text };
      }
      entity.link = entity.text;
      entity.children = entity.link;
      return entity;
    }
    case "inlineCodeblock": {
      return {
        type: "codeblock",
        lang: null,
        code: entity.params[0],
        children: entity.params[0]
      };
    }
    case "codeblock": {
      entity.lang = entity.params[0];
      entity.code = entity.params[1];
      entity.children = entity.code;
      return entity;
    }
    case "escape": {
      entity.token = entity.params[0];
      return entity;
    }
    case "userMention": {
      entity.member_id = entity.params[0];
      return entity;
    }
    case "channelMention": {
      entity.channel_id = entity.params[0];
      return entity;
    }
    case "messageQuote": {
      entity.message_id = entity.params[0];
      return entity;
    }
    case "custom": {
      entity.custom_type = entity.params[0];
      entity.expression = entity.params[1];
      return entity;
    }
    case "egg": {
      if (entity.text in eggs) {
        return { type: "color", color: eggs[entity.text] };
      } else {
        switch (entity.params[0]) {
          case "k":
            return { type: "consume", consume_type: "obfuscate" };
          case "l":
            return { type: "consume", consume_type: "bold" };
          case "m":
            return { type: "consume", consume_type: "strike" };
          case "n":
            return { type: "consume", consume_type: "underline" };
          case "o":
            return { type: "consume", consume_type: "italic" };
          case "r":
            return { type: "consume", consume_type: "reset" };
          default: {
            console.warn(`unhandled egg '${entity.text}'`);
            break;
          }
        }
      }
      break;
    }
    default: {
      if (entity.type != null) {
        console.warn(
          `unhandled entity transformation for entity '${entity.type}'`
        );
      }
      return entity;
    }
  }
}

export default {
  props: {
    text: String,
    message: Object
  },
  render() {
    const parse = text => parseEntities(parseRichText(text));
    const parseChildren = children => {
      switch (true) {
        case typeof children === "string":
          return children;
        case Array.isArray(children):
          return children.map(child => parseChildren(child));
        default:
          return parseEntities(children);
      }
    };

    function parseEntities(entities) {
      const result = [];
      for (let entity of entities) {
        result.push(parseEntity(entity, entities));
      }
      return result;
    }

    // do not use entity.params in here!
    // use spans when needed to be semantically/accessibly correct
    const parseEntity = (entity, entities) => {
      switch (entity.type) {
        case "bold":
          return <span class="bold">{parseChildren(entity.children)}</span>;
        case "italic":
          return <span class="italic">{parseChildren(entity.children)}</span>;
        case "strike":
          return <span class="strike">{parseChildren(entity.children)}</span>;
        case "code":
          return <code class="code">{parseChildren(entity.children)}</code>;
        case "underline":
          return (
            <span class="underline">{parseChildren(entity.children)}</span>
          );
        case "obfuscate":
          // todo: finish.
          return (
            <span class="obfuscate">{parseChildren(entity.children)}</span>
          );
        case "reset":
          return <span class="reset">{parseChildren(entity.children)}</span>;
        case "link":
          return <a href={entity.link}>{parseChildren(entity.children)}</a>;
        case "escape":
          return entity.token;
        case "codeblock":
          return (
            <pre class="codeblock">
              <code>{parseChildren(entity.children)}</code>
            </pre>
          );
        case "blockquote":
          return <blockquote>{parseChildren(entity.children)}</blockquote>;
        case "userMention": {
          const member = store.getters["members/members"][entity.member_id];
          if (member != null) {
            return <MemberMention member={member} />;
          } else {
            return entity.text;
          }
        }
        case "channelMention": {
          const channel = store.getters.channels[entity.channel_id];
          if (channel != null) {
            return <ChannelMention channel={channel} />;
          } else {
            return entity.text;
          }
        }
        case "messageQuote": {
          const quote = this?.message?.quotes?.find(
            q => q.messageID === entity.message_id
          );
          if (quote != null) {
            return (
              <MessageQuote
                quote={quote}
                formattingEnabled={entity.message_id !== this.message.uniqueID}
                message={this.message}
              />
            );
          } else {
            return entity.text;
          }
        }
        // wrap the rest of the entities in entity_type
        case "consume": {
          entity.type = entity.consume_type;
          entity.children = entities;
          return parseEntity(entity, entities);
        }
        case "color":
          return (
            <span style={{ color: entity.color }}>
              {parseChildren(entities)}
            </span>
          );
        case "custom":
          switch (entity.custom_type) {
            case "link": {
              const [url, text] = entity.expression
                .split("->")
                .map(s => s.trim());
              return parseEntity(
                { type: "link", text: text, link: url },
                entities
              );
            }
            case "#":
              return parseEntity(
                { type: "color", color: entity.expression.trim() },
                entities
              );
            default:
              console.warn(
                `unhandled custom expression '${entity.custom_type}'`
              );
              return entity.text;
          }
        default:
          if (entity.type) console.warn(`unhandled entity '${entity.type}'`);
          return parseChildren(entity.text);
      }
    };
    return <div>{parse(this.text || "")}</div>;
  }
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}

.strike {
  text-decoration: line-through;
}

.underline {
  text-decoration: underline;
}

.reset {
  display: inline-block;
  font-weight: normal;
  font-style: normal;
}

.code {
  color: #f9e6ff;
  background: rgba(0, 0, 0, 0.46);
}

.codeblock {
  padding: 0;
  margin: 0;
}

.codeblock {
  background-color: rgba(0, 0, 0, 0.46);
  border-radius: 4px;
  padding: 5px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

blockquote {
  margin: 0;
  padding: 0.3rem 0.6rem;
  border-left: 0.3rem #ccf2 solid;
  background: #efeffc22;
}
</style>