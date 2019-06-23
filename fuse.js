const { FuseBox, SassPlugin, CSSResourcePlugin } = require("fuse-box");
const { task } = require("fuse-box/sparky");
const { ncp } = require('ncp');

const fuse = FuseBox.init({
  homeDir: "packages/app",
  output: "build/public/script/$name.js",
  target: "browser@es6",
  useTypescriptCompiler: true,
  plugins: [
    [
      SassPlugin(),
      CSSResourcePlugin({
        dist: "build/public/style"
      })
    ]
  ]
});

fuse
  .bundle("github-star")
  .instructions(`> app.jsx`);

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