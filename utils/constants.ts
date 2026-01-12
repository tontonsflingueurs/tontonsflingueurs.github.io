import packageJson from "package.json" with { type: "json" };

export const GITHUB_REPO = packageJson.repository.url;
export const DEFAULT_IMAGE = "/blog/default.webp";
