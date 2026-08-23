const fs = require('fs');
const path = require('path');
const { withSettingsGradle, withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');

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

  config = withDangerousMod(config, [
    'android',
    (config) => {
      const maplibreBuildGradle = path.join(
        config.modRequest.projectRoot,
        'node_modules',
        '@maplibre',
        'maplibre-react-native',
        'android',
        'build.gradle'
      );

      if (fs.existsSync(maplibreBuildGradle)) {
        let contents = fs.readFileSync(maplibreBuildGradle, 'utf-8');

        if (contents.includes('buildscript {')) {
          const lines = contents.split('\n');
          const result = [];
          let i = 0;

          while (i < lines.length) {
            if (lines[i].includes('buildscript {')) {
              let depth = 1;
              i++;
              while (i < lines.length && depth > 0) {
                for (const ch of lines[i]) {
                  if (ch === '{') depth++;
                  if (ch === '}') depth--;
                }
                if (depth <= 0 && lines[i].trim() === '}') {
                  i++;
                  break;
                }
                i++;
              }
              continue;
            }
            result.push(lines[i]);
            i++;
          }

          contents = result.join('\n');

          const helperFunctions = `def getExtOrDefault(name) {
    return rootProject.ext.has(name) ? rootProject.ext.get(name) : project.properties['org.maplibre.reactnative.' + name]
}

def getExtOrIntegerDefault(name) {
    return (rootProject.ext.has(name) ? rootProject.ext.get(name) : project.properties['org.maplibre.reactnative.' + name]).toInteger()
}

def getConfigurableExtOrDefault(name) {
    return rootProject.ext.has("org.maplibre.reactnative." + name) ? rootProject.ext.get("org.maplibre.reactnative." + name) : project.properties["org.maplibre.reactnative." + name]
}

`;

          if (!contents.includes('def getExtOrDefault')) {
            contents = helperFunctions + contents;
          }

          fs.writeFileSync(maplibreBuildGradle, contents);
        }
      }

      return config;
    },
  ]);

  return config;
}

module.exports = withMapLibreNative;
