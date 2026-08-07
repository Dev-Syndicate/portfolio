/**
 * Renders a JSON-LD structured-data block. Server component; the schema is
 * serialised into a <script type="application/ld+json"> so crawlers read the
 * entity graph. Accepts one object or an array of them.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, static content built from our own config.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
