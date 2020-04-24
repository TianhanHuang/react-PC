const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");
const antdTheme = require("../theme.js");

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );
  config = rewireLess.withLoaderOptions({ modifyVars: antdTheme })(config, env);

  return config;
};
