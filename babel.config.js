module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins:['@babel/plugin-transform-react-jsx', 'react-native-reanimated/plugin'],
  };
};
