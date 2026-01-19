import packageJson from "package.json" with { type: "json" };

export const GITHUB_REPO = packageJson.repository.url;
export const DEFAULT_BLOG_IMAGE = "/blog/default.webp";
export const DEFAULT_WIKI_IMAGE = "/wiki/banniere.webp";
