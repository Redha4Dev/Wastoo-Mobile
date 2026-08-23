const { withSettingsGradle, withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

function withMapLibreNative(config) {
  config = withSettingsGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes("include ':maplibre-react-native'")) {
      config.modResults.contents = contents.replace(
        "include ':app'",
        "include ':app'\ninclude ':maplibre-react-native'\nproject(':maplibre-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/@maplibre/maplibre-react-native/android')"
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

  config = withProjectBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes('generateCodegenSchemaFromJavaScript')) {
      config.modResults.contents = contents.replace(
        'allprojects {',
        `allprojects {
  afterEvaluate { project ->
    if (project.name == "maplibre-react-native") {
      project.tasks.named("generateCodegenArtifactsFromSchema").configure {
        dependsOn project.tasks.named("generateCodegenSchemaFromJavaScript")
      }
    }
  }`
      );
    }
    return config;
  });

  return config;
}

module.exports = withMapLibreNative;
