import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";
import { name, version } from "./package.json" assert { type: "json" };

// Reusable variables
const groupId = "com.softsquare.keycloakify";
const artifactId = name;
const themeVersion = version;
const themeName = name;

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
            }
        })
    ]
});
