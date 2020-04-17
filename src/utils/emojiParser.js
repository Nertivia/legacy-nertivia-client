import twemoji from "twemoji";
import matchSorter from "match-sorter";
import emojis from "@/utils/emojiData/emojis.json";
import groups from "@/utils/emojiData/groups.json";
import { store } from "@/store/index";

export default {
  getCustomEmojisByShortCode(shortcode) {
    const customEmojis = store.state["settingsModule"].customEmojis;
    return customEmojis.find(emoji => emoji.name === shortcode);
  },
  replaceShortcode: message => {
    const customEmojis = store.state["settingsModule"].customEmojis;

    const regex = /:([\w]+):/g;

    return message.replace(regex, x => {
      const emoji = emojiExists(x.replace(/[::]+/g, ""));
      if (emoji) return emoji.unicode;

      const customEmoji = customEmojis.find(
        e => e.name === x.substr(1).slice(0, -1)
      );
      if (customEmoji) {
        if (customEmoji.gif) {
          return `<g:${customEmoji.name}:${customEmoji.emojiID}>`;
        }
        return `<:${customEmoji.name}:${customEmoji.emojiID}>`;
      }
      return x;
    });
  },
  emojiToShortcode: message => {
    // replace default emojis
    for (let emoji of emojis) {
      const search = emoji.unicode;
      const replace = `:${emoji.shortcodes[0]}:`;
      message = message.split(search).join(replace);
    }
    // replace custom emojis
    message = message.replace(/<(g?):([-\w]+):[-\w]+>/g, ":$2:");
    return message;
  },
  replaceEmojis: string => {
    return twemoji.parse(string, function(icon) {
      if (!icon) return string;
      return require("../assets/twemoji/" + icon + ".svg");
    });
  },
  GetEmojiPath: string => {
    let emojiPath;
    twemoji.parse(string, function(icon) {
      if (!icon) return string;
      emojiPath = require("../assets/twemoji/" + icon + ".svg");
    });
    return emojiPath;
  },
  searchEmoji: shortCode => {
    const customEmojis = store.state["settingsModule"].customEmojis;
    return [
      ...matchSorter(customEmojis, shortCode, {
        keys: ["name"],
        threshold: matchSorter.rankings.CONTAINS
      }),
      ...matchSorter(emojis, shortCode, {
        keys: ["shortcodes"],
        threshold: matchSorter.rankings.CONTAINS
      })
    ];
  },
  allEmojis: emojis,
  allGroups: groups
};

function emojiExists(shortCode) {
  return emojis.find(emoji =>
    emoji.shortcodes.find(emojiShortCode => shortCode === emojiShortCode)
  );
}
