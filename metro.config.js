const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Metro does not properly support the "exports" section in package.json,
// which OpenTelemetry uses. So, until we find a more permanent workaround,
// we can rewrite the relevant OTel imports manually.
//
// Note: Newer versions of metro have an unstable_enablePackageExports,
// which should do the trick, but doesn't currently work with OpenTelemetry.
config.resolver.resolveRequest = function (context, moduleName, platform) {
  const moduleNameRewrites = {
    '@opentelemetry/otlp-exporter-base/browser-http':
      '@opentelemetry/otlp-exporter-base/build/src/index-browser-http.js',
    '@opentelemetry/semantic-conventions/incubating':
      '@opentelemetry/semantic-conventions/build/src/index-incubating.js',
  };

  if (moduleNameRewrites[moduleName]) {
    moduleName = moduleNameRewrites[moduleName];
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Keep path aliases for convenience
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@context': path.resolve(__dirname, 'src/context'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@telemetry': path.resolve(__dirname, 'src/telemetry'),
  '@navigation': path.resolve(__dirname, 'src/navigation'),
  '@assets': path.resolve(__dirname, 'src/assets'),
};

module.exports = config;
