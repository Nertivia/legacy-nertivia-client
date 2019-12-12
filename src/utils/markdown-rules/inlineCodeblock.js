export default order => {
  return {
    order: order++,
    match: function(source) {
      return /^```([^\n]+)```(?!`)/.exec(source);
    },

    parse: function(capture) {
      return {
        type: "codeblock",
        lang: undefined,
        content: capture[1]
      };
    },
    html: null
  };
};
