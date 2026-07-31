import { useEffect } from 'react';

export default function useSEO(customSeo = null) {
  useEffect(() => {
    // If specific SEO is passed (like from a blog post detail)
    if (customSeo) {
      applySEO(customSeo);
      return;
    }

    // Otherwise, fetch general SEO settings from the backend API
    fetch('/api/settings/seo')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          applySEO(resData.data);
        }
      })
      .catch((err) => console.error('Error fetching SEO configuration:', err));
  }, [customSeo]);
}

function applySEO(seo) {
  if (!seo) return;

  // 1. Title
  if (seo.metaTitle || seo.siteTitle) {
    document.title = seo.metaTitle || seo.siteTitle;
  }

  // Helper to find or create meta tag
  const setMeta = (nameOrProperty, content) => {
    if (!content) return;
    const isProp = nameOrProperty.startsWith('og:');
    const selector = isProp 
      ? `meta[property='${nameOrProperty}']` 
      : `meta[name='${nameOrProperty}']`;
      
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (isProp) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Meta tags
  if (seo.metaDescription) {
    setMeta('description', seo.metaDescription);
    setMeta('og:description', seo.metaDescription);
  }
  if (seo.metaKeywords) {
    setMeta('keywords', seo.metaKeywords);
  }
  if (seo.ogImageUrl) {
    setMeta('og:image', seo.ogImageUrl);
  }
  
  // Title for OpenGraph
  setMeta('og:title', seo.metaTitle || seo.siteTitle);

  // 3. Canonical URL
  if (seo.canonicalUrl) {
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonicalUrl);
  }

  // 4. Favicon
  let favicon = document.querySelector("link[rel='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('type', 'image/png');
  favicon.setAttribute('href', '/logo.png');
}
