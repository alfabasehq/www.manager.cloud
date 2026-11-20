import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-relative URLs when the site is built with --pathprefix
  // (needed only while it is served from username.github.io/repository/).
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ public: "/" });

  return {
    dir: { input: "src", output: "_site" },
  };
}
