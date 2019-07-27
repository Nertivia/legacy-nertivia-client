export default function formatCode(md, opts) {
  const defaultRender = md.renderer.rules.code_inline || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  
  md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'code-inline']);
    return defaultRender(tokens, idx, options, env, self);
  };	
}