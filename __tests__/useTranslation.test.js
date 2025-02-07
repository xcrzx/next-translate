import React from "react"
import { render, cleanup } from "@testing-library/react"
import I18nProvider from "../src/I18nProvider"
import useTranslation from "../src/useTranslation"

const Inner = ({ i18nKey, query }) => {
  const { t } = useTranslation()
  return t(i18nKey, query)
}

const TestEnglish = ({ i18nKey, query, namespaces }) => {
  return (
    <I18nProvider lang="en" namespaces={namespaces}>
      <Inner i18nKey={i18nKey} query={query} />
    </I18nProvider>
  )
}

describe("useTranslation", () => {
  afterEach(cleanup)
  beforeAll(() => {
    console.warn = jest.fn()
  })

  describe("fallbacks", () => {
    test("should return an empty string if t(undefined)", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const test = t(undefined)
        return (
          <>
            {test} | {typeof test}
          </>
        )
      }

      const expected = " | string"

      const { container } = render(
        <I18nProvider lang="en" namespaces={{}}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toBe(expected)
    })

    test("should return the key as fallback WITH PROVIDER", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const test = t("ns:template-string")
        return (
          <>
            {test} | {typeof test}
          </>
        )
      }

      const expected = "ns:template-string | string"

      const { container } = render(
        <I18nProvider lang="en" namespaces={{}}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toBe(expected)
    })

    test("should return the key as fallback WITHOUT PROVIDER", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const test = t("ns:template-string")
        return (
          <>
            {test} | {typeof test}
          </>
        )
      }

      const expected = "ns:template-string | string"

      const { container } = render(<Inner />)
      expect(container.textContent).toBe(expected)
    })

    test("should return the key as fallback using a template string WITH PROVIDER", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const test = t`ns:template-string`
        return (
          <>
            {test} | {typeof test}
          </>
        )
      }

      const expected = "ns:template-string | string"

      const { container } = render(
        <I18nProvider lang="en" namespaces={{}}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toBe(expected)
    })

    test("should work with a defined default namespace | t as template string", () => {
      const Inner = () => {
        const { t } = useTranslation("a")
        return (
          <>
            {t`test`} {t`b:test`}
          </>
        )
      }

      const ns = {
        a: { test: "Test from A" },
        b: { test: "Test from B" },
      }

      const expected = "Test from A Test from B"

      const { container } = render(
        <I18nProvider lang="en" namespaces={ns}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toBe(expected)
    })

    test("should work with a defined default namespace | t as function", () => {
      const Inner = () => {
        const { t } = useTranslation("a")
        return (
          <>
            {t("test")} {t("b:test")}
          </>
        )
      }

      const ns = {
        a: { test: "Test from A" },
        b: { test: "Test from B" },
      }

      const expected = "Test from A Test from B"

      const { container } = render(
        <I18nProvider lang="en" namespaces={ns}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toBe(expected)
    })

    test("should return the key as fallback using a template string WITHOUT PROVIDER", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const test = t`ns:template-string`
        return (
          <>
            {test} | {typeof test}
          </>
        )
      }

      const expected = "ns:template-string | string"

      const { container } = render(<Inner />)
      expect(container.textContent).toBe(expected)
    })
  })

  describe("plurals", () => {
    test("should work with singular | count=1", () => {
      const i18nKey = "ns:withsingular"
      const expected = "The number is NOT ZERO"
      const withSingular = {
        withsingular: "The number is NOT ZERO",
        withsingular_0: "The number is ZERO!",
        withsingular_other: "Oops!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: withSingular }}
          i18nKey={i18nKey}
          query={{ count: 1 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with singular | count=0", () => {
      const i18nKey = "ns:withsingular"
      const expected = "The number is NOT ONE"
      const withSingular = {
        withsingular: "The number is NOT ONE",
        withsingular_1: "The number is ONE!",
        withsingular_other: "Oops!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: withSingular }}
          i18nKey={i18nKey}
          query={{ count: 0 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with _1 | count=1", () => {
      const i18nKey = "ns:withsingular"
      const expected = "The number is ONE!"
      const with_1 = {
        withsingular: "The number is NOT ONE",
        withsingular_1: "The number is ONE!",
        withsingular_other: "Oops!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: with_1 }}
          i18nKey={i18nKey}
          query={{ count: 1 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with _0 | count=0", () => {
      const i18nKey = "ns:withsingular"
      const expected = "The number is ZERO!"
      const with_0 = {
        withsingular: "The number is NOT ZERO",
        withsingular_0: "The number is ZERO!",
        withsingular_other: "Oops!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: with_0 }}
          i18nKey={i18nKey}
          query={{ count: 0 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with plural | count=2", () => {
      const i18nKey = "ns:withplural"
      const expected = "Number is bigger than one!"
      const withPlural = {
        withplural: "Singular",
        withplural_1: "The number is ONE!",
        withplural_other: "Number is bigger than one!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: withPlural }}
          i18nKey={i18nKey}
          query={{ count: 2 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with _2 | count=2", () => {
      const i18nKey = "ns:withplural"
      const expected = "The number is TWO!"
      const withPlural = {
        withplural: "Singular",
        withplural_2: "The number is TWO!",
        withplural_other: "Number is bigger than one!",
      }
      const { container } = render(
        <TestEnglish
          namespaces={{ ns: withPlural }}
          i18nKey={i18nKey}
          query={{ count: 2 }}
        />,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work as a template string", () => {
      const Inner = () => {
        const { t } = useTranslation()
        return t`ns:template-string`
      }

      const expected = "Example with template string"
      const templateString = {
        "template-string": "Example with template string",
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns: templateString }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })
  })

  describe("options", () => {
    test("should work with returnObjects option and Array locale", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const items = t("ns:template-array", {}, { returnObjects: true })
        return <>{items.map((i) => `${i.title} `)}</>
      }

      const expected = "Title 1 Title 2 Title 3"
      const templateString = {
        "template-array": [
          { title: "Title 1" },
          { title: "Title 2" },
          { title: "Title 3" },
        ],
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns: templateString }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work with returnObjects option and Object locale", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const { title, description } = t(
          "ns:template-object",
          {},
          { returnObjects: true },
        )
        return <>{`${title} ${description}`}</>
      }

      const expected = "Title 1 Description 1"
      const templateString = {
        "template-object": {
          title: "Title 1",
          description: "Description 1",
        },
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns: templateString }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })
    test("should work with returnObjects option and Object locale with interpolation", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const { title, description } = t(
          "ns:template-object-interpolation",
          { count: 2, something: "of title" },
          { returnObjects: true },
        )
        return <>{`${title} ${description}`}</>
      }

      const expected = "Title 2 Description of title"
      const templateString = {
        "template-object-interpolation": {
          title: "Title {{count}}",
          description: "Description {{something}}",
        },
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns: templateString }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work fallback as string", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const description = t("ns:description2", {}, { fallback: "ns:title" })
        return <>{description}</>
      }

      const expected = "Title 1"
      const ns = {
        title: "Title 1",
        description: "Description 1",
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work fallback as array of strings", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const description = t(
          "ns:description2",
          {},
          { fallback: ["ns:noexistent", "ns:title"] },
        )
        return <>{description}</>
      }

      const expected = "Title 1"
      const ns = {
        title: "Title 1",
        description: "Description 1",
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should ignore fallback if is not an array of string or string | array of objects", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const description = t(
          "ns:description2",
          {},
          { fallback: [{}, "ns:title"] },
        )
        return <>{description}</>
      }

      const expected = "ns:description2"
      const ns = {
        title: "Title 1",
        description: "Description 1",
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should ignore fallback if is not an array of string or string | object", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const description = t("ns:description2", {}, { fallback: {} })
        return <>{description}</>
      }

      const expected = "ns:description2"
      const ns = {
        title: "Title 1",
        description: "Description 1",
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should work fallback with returnObjects option and Object locale with interpolation", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const { title, description } = t(
          "ns:noexistent",
          { count: 2, something: "of title" },
          {
            returnObjects: true,
            fallback: ["ns:blabla", "ns:template-object-interpolation"],
          },
        )
        return <>{`${title} ${description}`}</>
      }

      const expected = "Title 2 Description of title"
      const templateString = {
        "template-object-interpolation": {
          title: "Title {{count}}",
          description: "Description {{something}}",
        },
      }

      const { container } = render(
        <I18nProvider lang="en" namespaces={{ ns: templateString }}>
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })

    test("should support alternative interpolation delimeter options", () => {
      const Inner = () => {
        const { t } = useTranslation()
        const text = t("ns:template-object-interpolation", {
          count: 3,
          something: "cats",
        })
        return <>{text}</>
      }

      const expected = "There are 3 cats."
      const templateString = {
        "template-object-interpolation": "There are ${count} ${something}.",
      }

      const config = {
        interpolation: {
          prefix: "${",
          suffix: "}",
        },
      }

      const { container } = render(
        <I18nProvider
          lang="en"
          namespaces={{ ns: templateString }}
          config={config}
        >
          <Inner />
        </I18nProvider>,
      )
      expect(container.textContent).toContain(expected)
    })
  })
})
