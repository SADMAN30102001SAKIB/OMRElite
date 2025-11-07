const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  maxWorkers: 2, // Reduce from default (usually 4-8)
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
