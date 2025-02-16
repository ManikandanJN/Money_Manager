const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const os = require('os');

const getMaxWorkers = () => {
  return typeof os.availableParallelism === 'function'
    ? os.availableParallelism()
    : os.cpus().length;
};

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  maxWorkers: getMaxWorkers(),
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'png'], // Ensure PNG files are resolved
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
});

