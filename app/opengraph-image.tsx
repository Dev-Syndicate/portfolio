import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { seo, site } from "@/lib/content";

/**
 * The branded social share card (1200×630) used for link previews across
 * Slack, X, LinkedIn, iMessage, etc. Generated at build time with next/og.
 *
 * ImageResponse only supports flexbox + a CSS subset, so this is a hand-laid
 * flex composition on the brand void with the DS mark and wordmark — no WebGL
 * or grid here. Colours are the literal brand hexes (ImageResponse can't read
 * CSS custom properties).
 */

export const alt = `${site.name} — ${seo.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
        {/* Top: mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" />
          <span
            style={{
              color: "#f6f6f7",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {site.name}
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
            <span
              style={{ width: 10, height: 10, background: "#afb4bc" }}
            />
            {seo.tagline}
          </div>
          <div
            style={{
              color: "#f6f6f7",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Building digital experiences that help businesses grow.
          </div>
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            display: "flex",
            color: "#6b7280",
            fontSize: 26,
            letterSpacing: "0.02em",
          }}
        >
          devsyndicate.in
        </div>
      </div>
    ),
    { ...size },
  );
}
