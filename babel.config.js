
module.exports = function (api) {
  api.cache(true);

  const presets = [ '@vue/app' ];
  const plugins = [ '@babel/plugin-syntax-dynamic-import'];

  return {
    presets,
    plugins
  };
}