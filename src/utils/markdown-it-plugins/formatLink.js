export default function formatLink(md, opts) {
  const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
    tokens[idx].attrPush(['class', 'msg-link']);
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
}