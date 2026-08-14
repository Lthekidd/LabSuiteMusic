import { execSync } from "node:child_process";
import { defineConfig } from "vite";

let gitBranch: string = "";
try {
  gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString();
} catch (e) {
  // User has likely downloaded from the YTM Desktop via the "Download ZIP".
  // We don't plan to support this, but at least provide users with a bit of improved UX
  // by providing them with what to do rather than just leaving them in the dust.
  e.message =
    " ======= Failed to get Git Info. ======= \n" +
    "Please make sure that when building this application you are cloning the repository from GitHub rather than using the Download ZIP option.\n" +
    "Follow the instructions in the README.md file to clone the repository and build the application from there.\n" +
    " ======= Failed to get Git Info. ======= \n\n" +
    e.message;
  // Re-throw the error so that the build fails with the updated message.
  throw e;
}

// Reading the branch remains a build-integrity check. The hardened companion
// deliberately has no runtime updater; releases are installed by LabSuite.
void gitBranch;

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: ".vite/main",
    rollupOptions: {
      external: ["bufferutil", "utf-8-validate"]
    }
  }
});
