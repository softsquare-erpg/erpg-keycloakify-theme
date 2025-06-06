import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            groupId: "com.softsquare.keycloakify",
            artifactId: "erpg-keycloakify-theme",
            themeVersion: "1.0.0",
            themeName: "erpg-keycloakify-theme",
            accountThemeImplementation: "none"
        })
    ]
});
