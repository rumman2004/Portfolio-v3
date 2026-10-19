import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Rumman Ahmed — Portfolio';
const DEFAULT_DESCRIPTION = 'Portfolio, projects, and professional experience.';

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  name = "Rumman Ahmed",
  type = "website",
   keywords = "Rumman Ahmed, Portfolio, Web Developer, Full Stack Developer, React, Node.js",
  image = "/favicon.jpeg",
  url
}) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '/';
  const canonicalUrl = url ? new URL(url, origin || 'http://localhost').toString() : currentUrl;
  const imageUrl = image ? new URL(image, origin || 'http://localhost').toString() : undefined;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={name} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph tags for Facebook, LinkedIn, etc. */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
       <meta property="og:url" content={canonicalUrl} />
       <meta property="og:site_name" content={name} />
       {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
       {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
};

export default SEO;
