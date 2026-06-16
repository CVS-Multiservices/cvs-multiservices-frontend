import { useEffect } from 'react';

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

export default function SEOMeta({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  schema,
}: SEOMetaProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('CVS Multi Services') 
      ? title 
      : `${title} | CVS Multi Services`;
    document.title = formattedTitle;

    // Helper function to set or update meta tags in <head>
    const setMetaTag = (nameAttr: string, value: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${nameAttr}"]`);
      if (element) {
        element.setAttribute('content', value);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, nameAttr);
        element.setAttribute('content', value);
        document.head.appendChild(element);
      }
    };

    // Helper function to set or update link tags in <head>
    const setLinkTag = (relAttr: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${relAttr}"]`);
      if (element) {
        element.setAttribute('href', hrefValue);
      } else {
        element = document.createElement('link');
        element.setAttribute('rel', relAttr);
        element.setAttribute('href', hrefValue);
        document.head.appendChild(element);
      }
    };

    // 2. Set description, keywords, Open Graph, and Twitter tags
    setMetaTag('description', description);
    
    if (keywords) {
      setMetaTag('keywords', keywords);
    } else {
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      if (existingKeywords) existingKeywords.remove();
    }

    setMetaTag('og:type', ogType, true);
    setMetaTag('og:title', ogTitle || formattedTitle, true);
    setMetaTag('og:description', ogDescription || description, true);
    
    const currentUrl = window.location.origin + window.location.pathname;
    const resolvedCanonical = canonical || currentUrl;
    setMetaTag('og:url', resolvedCanonical, true);

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
    } else {
      // Default fallback logo image
      setMetaTag('og:image', `${window.location.origin}/apple-touch-icon.png`, true);
    }

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', ogTitle || formattedTitle);
    setMetaTag('twitter:description', ogDescription || description);
    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
    } else {
      setMetaTag('twitter:image', `${window.location.origin}/apple-touch-icon.png`);
    }

    // 3. Set Canonical Link
    setLinkTag('canonical', resolvedCanonical);

    // 4. Inject JSON-LD Structured Data Schema
    let schemaScript = document.getElementById('seo-schema-jsonld') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Cleanup script on unmount
    return () => {
      const script = document.getElementById('seo-schema-jsonld');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogType, schema]);

  return null;
}
