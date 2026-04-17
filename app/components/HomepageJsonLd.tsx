import { getTranslations } from "next-intl/server";
import { JsonLd } from "./JsonLd";

type Props = {
  locale: string;
};

export async function HomepageJsonLd({ locale }: Props) {
  const [t, tMeta, tPricing] = await Promise.all([
    getTranslations({ locale, namespace: "FAQ" }),
    getTranslations({ locale, namespace: "Metadata" }),
    getTranslations({ locale, namespace: "Pricing" }),
  ]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Uygun Davet",
    alternateName: "Davetiye",
    url: siteUrl,
    description: tMeta("description"),
    inLanguage: ["tr", "en", "de"],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Uygun Davet",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo-gold.png`,
      width: 512,
      height: 512,
    },
    description: tMeta("description"),
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English", "German"],
    },
  };

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const packages = [
    {
      name: tPricing("starter.name"),
      description: tPricing("starter.desc"),
      price: tPricing("starter.price"),
    },
    {
      name: tPricing("pro.name"),
      description: tPricing("pro.desc"),
      price: tPricing("pro.price"),
    },
    {
      name: tPricing("business.name"),
      description: tPricing("business.desc"),
      price: tPricing("business.price"),
    },
  ];

  const extractPrice = (priceStr: string): string => {
    const match = priceStr.match(/[\d.]+/);
    return match ? match[0].replace(".", "") : "0";
  };

  const productSchemas = packages.map((pkg) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Uygun Davet - ${pkg.name}`,
    description: pkg.description,
    brand: {
      "@type": "Brand",
      name: "Uygun Davet",
    },
    offers: {
      "@type": "Offer",
      price: extractPrice(pkg.price),
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#fiyatlar`,
    },
  }));

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Digital Wedding Invitation",
    provider: {
      "@type": "Organization",
      name: "Uygun Davet",
    },
    name: tMeta("title"),
    description: tMeta("description"),
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wedding Invitation Packages",
      itemListElement: packages.map((pkg, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: pkg.name,
          description: pkg.description,
        },
        price: extractPrice(pkg.price),
        priceCurrency: "TRY",
        position: index + 1,
      })),
    },
  };

  return (
    <JsonLd
      data={[
        websiteSchema,
        organizationSchema,
        faqSchema,
        serviceSchema,
        ...productSchemas,
      ]}
    />
  );
}
