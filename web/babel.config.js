function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === "babel-loader");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: web ? "entry" : undefined,
          corejs: web ? "core-js@3" : false,
          targets: !web ? { node: "current" } : undefined,
          modules: webpack ? false : "commonjs",
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      "@loadable/babel-plugin",
      !web && "@babel/plugin-syntax-dynamic-import",
      [
        "babel-plugin-styled-components",
        {
          ssr: true,
          displayName: false,
        },
      ],
      web && !api.env("production") && "react-refresh/babel",
    ].filter(Boolean),
  };
};
