
module.exports = function (api) {
  api.cache(true);

  const presets = [ '@vue/cli-plugin-babel/preset' ];
  const plugins = [ '@babel/plugin-syntax-dynamic-import'];

  return {
    presets,
    plugins
  };
}