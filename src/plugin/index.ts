import { hasHOC } from "./utils"

export default function nextTranslate(nextConfig: any = {}) {
  const fs = require("fs")
  const path = require("path")
  const test = /\.(tsx|ts|js|mjs|jsx)$/

  // NEXT_TRANSLATE_PATH env is supported both relative and absolute path
  const dir = path.resolve(
    path.relative(process.cwd(), process.env.NEXT_TRANSLATE_PATH || "."),
  )

  const arePagesInsideSrc = fs.existsSync(path.join(dir, "src/pages"))

  const i18n = nextConfig.i18n || {}
  const {
    locales,
    defaultLocale,
    loader = true,
    pages,
    logger,
    ...restI18n
  } = require(path.join(dir, "i18n"))

  // Check if exist a getInitialProps on _app.js
  let hasGetInitialPropsOnAppJs = false
  const pagesPath = path.join(dir, arePagesInsideSrc ? "/src/pages" : "/pages")
  const app = fs.readdirSync(pagesPath).find((page) => page.startsWith("_app."))

  if (app) {
    const code = fs.readFileSync(path.join(pagesPath, app)).toString("UTF-8")
    hasGetInitialPropsOnAppJs =
      !!code.match(/\WgetInitialProps\W/g) || hasHOC(code)
  }

  return {
    ...nextConfig,
    i18n: {
      ...i18n,
      ...restI18n,
      locales,
      defaultLocale,
    },
    webpack(conf, options) {
      const config =
        typeof nextConfig.webpack === "function"
          ? nextConfig.webpack(conf, options)
          : conf

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@next-translate-root": path.resolve(dir),
      }

      // we give the opportunity for people to use next-translate without altering
      // any document, allowing them to manually add the necessary helpers on each
      // page to load the namespaces.
      if (!loader) return config

      config.module.rules.push({
        test,
        use: {
          loader: "@portfolioslab/next-translate/plugin/loader",
          options: {
            extensionsRgx: test,
            hasGetInitialPropsOnAppJs,
            hasAppJs: !!app,
            pagesPath: path.join(pagesPath, "/"),
            hasLoadLocaleFrom: typeof restI18n.loadLocaleFrom === "function",
          },
        },
      })

      return config
    },
  }
}
