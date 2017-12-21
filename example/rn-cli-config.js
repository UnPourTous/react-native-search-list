// https://github.com/facebook/metro/issues/1
const path = require('path')
const config = {
  extraNodeModules: {
    "react-native": path.resolve(__dirname, "node_modules/react-native"),
    "react": path.resolve(__dirname, "node_modules/react"),
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),
      // Include your forked package as a new root.
      path.resolve(__dirname, '..')
    ]
  }
}
module.exports = config;