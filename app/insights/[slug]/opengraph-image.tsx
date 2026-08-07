import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { articles, getArticle } from "@/lib/articles";
import { site } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

/** Per-article social share card — the article title on the brand void. */
export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? site.name;

  const logo = await readFile(
    join(process.cwd(), "public", "dev-syndicate-logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(1200px 600px at 80% -10%, #1b1d22 0%, #0a0a0c 60%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#afb4bc",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 10, height: 10, background: "#afb4bc" }} />
          Insights
        </div>

        <div
          style={{
            color: "#f6f6f7",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={44} height={44} alt="" />
          <span style={{ color: "#f6f6f7", fontSize: 26, fontWeight: 700 }}>
            {site.name}
          </span>
          <span style={{ color: "#6b7280", fontSize: 22 }}>
            · devsyndicate.in
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
