# ERPG Keycloakify Custom Theme

This Theme Fork from [Keycloakify](https://github.com/keycloakify/keycloakify-starter) v11 starter 🚀

## Quick start

```bash
git clone https://github.com/softsquare-erpg/erpg-keycloakify-theme
cd erpg-keycloakify-theme
npm install --global yarn
yarn set version 4.5.1
yarn install # Or use an other package manager, just be sure to delete the yarn.lock if you use another package manager.
```

## Update Package.json

-   **Version:** `your theme version`
-   **Author:** `github username`
-   **Repository:** `your repository`
-   **Description:** `description for your theme`
-   **publishConfig** `your maven.pkg.github.com`

## Update CSS Style Theme

-   **light.css** `color scheme and background image`
-   **loading.css** `loading color`

## Testing the theme locally

### Outside of Keycloak

The recommended way to preview your theme as you develop it is to use [Storybook](https://storybook.js.org/)

The starter template does not initially contain any story files, instead there's a keycloakify CLI command that let's you import specifically the stories for the pages you want to test into your project.

So, just run this command in the root of your Keycloakify project and select the pages you want.

```bash
yarn run keycloakify add-story
```

Once your added a few stories you can start Storybook locally with:

```bash
yarn run storybook
```

### Inside of Keycloak

Testing your theme in Storybook is helpful, but eventually, you'll need to test it in a real Keycloak instance before deploying it to production.

#### Prerequisites

1. Install Docker
2. Install Java

```bash
yarn run keycloakify start-keycloak
```

## Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.9.9, Java >= 17).
The `mvn` command must be in the $PATH.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

If you use sdkman you can execute to prepare the proper Java SDK.

```bash
sdk env install
```

```bash
yarn run build-keycloak-theme
```

## Deploy the theme

Execute to deploy maven to your maven.pkg.github.com

```bash
./deploy-maven.sh
```
