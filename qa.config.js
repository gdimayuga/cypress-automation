const { defineConfig } = require("cypress");
const baseConfig = require("./cypress.config");

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://parabank.parasoft.com/parabank/register.htm", // QA URL
  },
  env: {
    projectName: "QA API Testing",
    environment: "qa",
    authToken: "Bearer STATIC_TOKEN_123"
  }
});