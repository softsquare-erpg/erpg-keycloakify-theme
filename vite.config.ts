import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
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
            }
        })
    ]
});
