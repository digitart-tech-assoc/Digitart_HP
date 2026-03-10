import { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "./constants";

type CustomMetadataProps = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
};

export function getCustomMetadata({
  title,
  description,
  image,
  path = "",
}: CustomMetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;
  const pageUrl = `${SITE_URL}${path}`;
  const imageUrl = image || `${SITE_URL}/images/digitart_OGP.jpg`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}
