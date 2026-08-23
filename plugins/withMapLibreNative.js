const { withAppBuildGradle, withSettingsGradle } = require('@expo/config-plugins');

function withMapLibreNative(config) {
  config = withSettingsGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes("include ':maplibre-react-native'")) {
      config.modResults.contents = contents.replace(
        "include ':app'",
        "include ':app'\ninclude ':maplibre-react-native'"
      );
    }
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes("implementation project(':maplibre-react-native')")) {
      config.modResults.contents = config.modResults.contents.replace(
        'implementation("com.facebook.react:react-android")',
        'implementation("com.facebook.react:react-android")\n    implementation project(\':maplibre-react-native\')'
      );
    }
    return config;
  });

  return config;
}

module.exports = withMapLibreNative;
