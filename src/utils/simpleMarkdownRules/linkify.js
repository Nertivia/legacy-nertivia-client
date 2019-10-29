import SimpleMarkdown from 'simple-markdown';
import linkify from 'linkify-it'
const linkifyInstance = linkify();


export default {
  // Specify the order in which this rule is to be run
  // This rule doesn't conflict with much else, so it should be fine to just put it before the
  // general-case text rule:
  order: SimpleMarkdown.defaultRules.link - 0.5,

  // First we check whether a string matches
  match: function(source) {
    return linkifyInstance.match(source)
  },

  // Then parse this string into a syntax node
  parse: function(capture, parse, state) {
    console.log(capture)
    return {
      content: parse(capture[0], state),
    };
  },

  // Finally transform this syntax node into an html element:
  html: function(node, output, state) {
    return 'owo'
  }
}