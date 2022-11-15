module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    // 'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '~': './src/',
          '~assets': './assets/',
          '~locales': './src/locales/',
        },
      },
    ],
  ],
  env: {
    production: {
      // 移除所有打印
      plugins: ['transform-remove-console'],
    },
  },
};
