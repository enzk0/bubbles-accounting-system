import { defineConfig } from "vitest/config";
import "dotenv/config";

let config;

if (process.env.TESTING_TYPE === "unit") {
    console.log("Setting up testing vitest configuration for unit testing...");
    console.warn(
        `TESTING_TYPE is set to ${process.env.TESTING_TYPE}. Interaction between dependencies will not work in this configuration!`
    );
    config = defineConfig({
        test: {
            clearMocks: true,
            environment: "node",
            setupFiles: ["./singleton.js"],
            include: ["**/*.test.js"],
            exclude: [
                "**/*.integration.test.js",
                "**/*.template.test.js",
                "**/*.template.integration.test.js",
                "**/node_modules/**",
                "**/dist/**",
                "**/cypress/**",
                "**/.{idea,git,cache,output,temp}/**",
                "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
            ],
        },
    });
}

if (process.env.TESTING_TYPE === "integration") {
    console.log(
        "Setting up testing vitest configuration for integration testing..."
    );
    console.warn(
        `TESTING_TYPE is set to ${process.env.TESTING_TYPE}. Mocking will not work in this configuration!`
    );
    config = defineConfig({
        test: {
            clearMocks: true,
            environment: "node",
            setupFiles: [],
            include: ["**/*.integration.test.js"],
            exclude: [
                "**/*.template.test.js",
                "**/*.template.integration.test.js",
                "**/node_modules/**",
                "**/dist/**",
                "**/cypress/**",
                "**/.{idea,git,cache,output,temp}/**",
                "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
            ],
        },
    });
}

export default config;
