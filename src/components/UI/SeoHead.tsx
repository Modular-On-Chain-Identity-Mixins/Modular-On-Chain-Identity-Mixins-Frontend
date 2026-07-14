import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description?: string;
}

const SITE_NAME = 'Compliance Kit';

export function SeoHead({ title, description }: SeoHeadProps) {
  const fullTitle = `${title} · ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}
      <meta property="og:title" content={fullTitle} />
    </Helmet>
  );
}
