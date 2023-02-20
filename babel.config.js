var path = require('path');

module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: 'react-native-dotenv',
          configDir: path.resolve(__dirname, "../../")
        },
      ],
    ],
  };
};
