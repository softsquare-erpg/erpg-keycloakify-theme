import react from "@vitejs/plugin-react";
import { cp } from "fs/promises";
import { keycloakify } from "keycloakify/vite-plugin";
import { join, resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" assert { type: "json" };

// Reusable variables
const groupId = "com.softsquare.keycloakify";
const artifactId = pkg.name;
const themeVersion = pkg.version;
const themeName = pkg.name;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            groupId,
            artifactId,
            themeVersion,
            themeName,
            accountThemeImplementation: "none",
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": `${artifactId}.jar`
            },
            startKeycloakOptions: {
                dockerExtraArgs: [`-e KC_CLIENT_1_URL=https://my-theme.keycloakify.dev`],
                keycloakExtraArgs: [`--spi-theme-welcome-theme=${themeName}`]
            },
            postBuild: async ({ keycloakifyBuildDirPath }) => {
                const destThemePath = join(
                    keycloakifyBuildDirPath,
                    "resources/theme",
                    themeName,
                    "welcome"
                );
                const sourceWelcomePath = resolve(__dirname, "src", "welcome");

                try {
                    await cp(sourceWelcomePath, destThemePath, {
                        recursive: true
                    });
                } catch (error) {
                    throw new Error(`Error copying welcome folder: ${error}`);
                }
            }
        })
    ]
});
