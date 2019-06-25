const { FuseBox, SassPlugin, RawPlugin } = require("fuse-box");
const { task } = require("fuse-box/sparky");
const { ncp } = require('ncp');

const PROD = true;

const fuse = FuseBox.init({
  homeDir: "./",
  output: "build/public/script/$name.js",
  target: "browser@es6",
  sourceMaps: !PROD,
  useTypescriptCompiler: true,
  alias: {
    "react": "~/node_modules/react/index",
    "react-dom": "~/node_modules/react-dom/index",
    "redux": "~/node_modules/redux/dist/redux.min",
    "react-redux": "~/node_modules/react-redux/dist/react-redux.min"
  },
  allowSyntheticDefaultImports: true,
  plugins: [
    [
      SassPlugin({
        outputStyle: "compressed",
      }),
      RawPlugin()
    ]
  ]
});

fuse
  .bundle("github-star")
  .cache(false)
  .instructions(`> ./packages/app/app.jsx`);

task("default", () => {
  ncp("packages/app-server", "build", {
    clobber: true
  }, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Copied server to build.');
  });
})

fuse.run();