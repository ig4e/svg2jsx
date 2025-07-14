import { SvgToJsxConverter } from "~/components/svg-to-jsx-converter";

export default async function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SVG to JSX Converter",
    description:
      "Free online tool to convert SVG code to React JSX components with SVGO optimization, TypeScript support, and Prettier formatting.",
    url: "https://svg2jsx.ahmedmohamed.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Ahmed Mohamed",
    },
    publisher: {
      "@type": "Person",
      name: "Ahmed Mohamed",
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "SVG to JSX, SVG to React, Convert SVG, React components, JSX converter, SVG optimizer, SVGO, TypeScript",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SvgToJsxConverter />
    </>
  );
}
