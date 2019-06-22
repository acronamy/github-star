const { FuseBox, SassPlugin, CSSPlugin, HTMLPlugin, BabelPlugin } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "packages",
  output: "build/$name.js",
  target: "browser@es6",
  plugins: [
    BabelPlugin({
      config: {
        sourceMaps: true,
        presets: ["@babel/preset-react"],
        plugins: [["transform-react-jsx"]],
      },
    }),
    SassPlugin(),
    CSSPlugin()
  ]
});

fuse.bundle("github-star").instructions(`> index.ts`);

fuse.run();