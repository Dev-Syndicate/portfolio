/**
 * A focused Markdown ⇄ HTML bridge for the rich editor.
 *
 * The blog stores Markdown and renders it with react-markdown, so the WYSIWYG
 * editor has to round-trip through Markdown without drifting. Rather than pull a
 * general HTML-to-Markdown library (and inherit whatever it does with edge
 * cases), this handles exactly the subset the editor exposes — headings, bold,
 * italic, links, inline code, bullet/ordered lists, blockquotes, code blocks,
 * horizontal rules — so what you can format is exactly what serialises.
 *
 * `mdToHtml` seeds Tiptap's initial document from stored Markdown; Tiptap owns
 * the document after that. `htmlToMarkdown` serialises the editor's HTML back to
 * Markdown on every change into the hidden form field.
 */

/* ── Markdown → HTML (initial content only) ─────────────────────────────── */

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline spans: code first (so its content isn't further parsed), then links,
    bold, italic. Deliberately small and predictable. */
function inlineMdToHtml(text: string): string {
  let t = escapeHtml(text);
  // `code`
  t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // [label](url)
  t = t.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, label, url) => `<a href="${url}">${label}</a>`,
  );
  // **bold** / __bold__
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // *italic* / _italic_
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  t = t.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  return t;
}

export function mdToHtml(md: string): string {
  const lines = (md ?? "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  // Buffers for grouped block types.
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${inlineMdToHtml(para.join(" "))}</p>`);
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```lang … ```
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      flushPara();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      html.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // Blank line ends a paragraph.
    if (line.trim() === "") {
      flushPara();
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushPara();
      html.push("<hr>");
      i++;
      continue;
    }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      const level = h[1].length;
      html.push(`<h${level}>${inlineMdToHtml(h[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote (consecutive `>` lines)
    if (/^>\s?/.test(line)) {
      flushPara();
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote><p>${inlineMdToHtml(buf.join(" "))}</p></blockquote>`);
      continue;
    }

    // Ordered list (consecutive `1.` lines)
    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(inlineMdToHtml(lines[i].replace(/^\d+\.\s+/, "")));
        i++;
      }
      html.push(`<ol>${items.map((t) => `<li><p>${t}</p></li>`).join("")}</ol>`);
      continue;
    }

    // Bullet list (consecutive `-`/`*`/`+` lines)
    if (/^[-*+]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(inlineMdToHtml(lines[i].replace(/^[-*+]\s+/, "")));
        i++;
      }
      html.push(`<ul>${items.map((t) => `<li><p>${t}</p></li>`).join("")}</ul>`);
      continue;
    }

    // Otherwise: paragraph text (soft-wrapped lines join with a space).
    para.push(line.trim());
    i++;
  }
  flushPara();

  return html.join("");
}

/* ── HTML → Markdown (on every editor change) ───────────────────────────── */

/** Serialise a DOM node's children to Markdown inline text. */
function inlineToMd(node: Node): string {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? "";
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const inner = inlineToMd(el);
    switch (el.tagName) {
      case "STRONG":
      case "B":
        out += `**${inner}**`;
        break;
      case "EM":
      case "I":
        out += `*${inner}*`;
        break;
      case "CODE":
        out += `\`${el.textContent ?? ""}\``;
        break;
      case "A": {
        const href = el.getAttribute("href") ?? "";
        out += `[${inner}](${href})`;
        break;
      }
      case "BR":
        out += "\n";
        break;
      default:
        out += inner;
    }
  });
  return out;
}

/** Serialise a full HTML string (Tiptap output) to Markdown. */
export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: string[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;

    switch (el.tagName) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6": {
        const level = Number(el.tagName[1]);
        blocks.push(`${"#".repeat(level)} ${inlineToMd(el).trim()}`);
        break;
      }
      case "P": {
        const t = inlineToMd(el).trim();
        if (t) blocks.push(t);
        break;
      }
      case "BLOCKQUOTE": {
        // Each inner paragraph becomes a `>` line.
        const lines: string[] = [];
        el.childNodes.forEach((c) => {
          if (c.nodeType === Node.ELEMENT_NODE) {
            const t = inlineToMd(c as HTMLElement).trim();
            if (t) lines.push(`> ${t}`);
          }
        });
        if (!lines.length) {
          const t = inlineToMd(el).trim();
          if (t) lines.push(`> ${t}`);
        }
        blocks.push(lines.join("\n"));
        break;
      }
      case "UL": {
        const items: string[] = [];
        el.querySelectorAll(":scope > li").forEach((li) => {
          items.push(`- ${inlineToMd(li).trim()}`);
        });
        blocks.push(items.join("\n"));
        break;
      }
      case "OL": {
        const items: string[] = [];
        let n = 1;
        el.querySelectorAll(":scope > li").forEach((li) => {
          items.push(`${n}. ${inlineToMd(li).trim()}`);
          n++;
        });
        blocks.push(items.join("\n"));
        break;
      }
      case "PRE": {
        const code = el.querySelector("code");
        const text = (code ?? el).textContent ?? "";
        blocks.push("```\n" + text.replace(/\n$/, "") + "\n```");
        break;
      }
      case "HR":
        blocks.push("---");
        break;
      default: {
        const t = inlineToMd(el).trim();
        if (t) blocks.push(t);
      }
    }
  });

  // Blank line between blocks — the Markdown the blog renderer expects.
  return blocks.join("\n\n").trim();
}
