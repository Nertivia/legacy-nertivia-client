import SimpleMarkdown from 'simple-markdown';

export default {
  // Specify the order in which this rule is to be run
  // This rule doesn't conflict with much else, so it should be fine to just put it before the
  // general-case text rule:
  order: SimpleMarkdown.defaultRules.text.order - 0.5,

  // First we check whether a string matches
  match: function(source) {
    // // || followed by any character repeated [\s\S]+? followed by ||
    // // Also see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions for more info on regexes
    return /^\<\:([\S]+?)\:([\S]+?)>/.exec(source);
  },

  // Then parse this string into a syntax node
  parse: function(capture, parse, state) {
    return {
      // capture[1] is the parenthesis group from the regex in `match`:
      name: parse(capture[1], state),
      id: parse(capture[2], state)
    };
  },

  // Finally transform this syntax node into an html element:
  html: function(node, output, state) {
    return '<img class="emoji" title="' + output(node.name, state)  + '" alt="' + output(node.name, state)  + '" src="https://supertiger.tk/api/media/' + output(node.id, state)  + '">'
  }
}