"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Minus,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { mdToHtml, htmlToMarkdown } from "./markdown";

/**
 * A Word-like rich editor for the post body. You format text directly — bold,
 * headings, lists, quotes, links — and see the result as you type, instead of
 * writing raw Markdown. It still *stores* Markdown (via a hidden field the form
 * submits) so the blog's render pipeline is unchanged; the editor is purely a
 * nicer way in.
 *
 * Built on Tiptap. `defaultMarkdown` seeds the document once; every change
 * serialises back to Markdown and is pushed up through `onChange`.
 */

type Props = {
  defaultMarkdown?: string;
  onChange: (markdown: string) => void;
  /** id for the label's htmlFor to point at the editable region. */
  id?: string;
  className?: string;
};

/** One toolbar button. */
function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-md border text-muted-foreground transition-colors",
        "hover:border-border-strong hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-transparent",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

const BLOCK_STYLES = [
  { label: "Paragraph", level: 0 },
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
  { label: "Heading 4", level: 4 },
] as const;

/** Paragraph / H1–H4 picker — the "Style" control, Word-like. */
function StyleDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  // Which style is active at the cursor.
  const active =
    BLOCK_STYLES.find(
      (s) => s.level > 0 && editor.isActive("heading", { level: s.level }),
    ) ?? BLOCK_STYLES[0];

  function apply(level: number) {
    // Run the command FIRST — closing the menu re-renders and can otherwise
    // interrupt the click before the chain fires.
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      // setHeading (not toggle): picking "Heading 1" should always *set* H1,
      // never toggle it back to a paragraph when it's already active.
      editor
        .chain()
        .focus()
        .setHeading({ level: level as 1 | 2 | 3 | 4 })
        .run();
    }
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 items-center gap-1.5 rounded-md border border-transparent px-2.5 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-border-strong"
      >
        {active.label}
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </button>
      {open ? (
        <>
          {/* click-away */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute top-full left-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border-strong bg-popover py-1 shadow-[var(--elevation-2)]"
          >
            {BLOCK_STYLES.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  role="option"
                  aria-selected={s.label === active.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply(s.level)}
                  className={cn(
                    "flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-surface-subtle",
                    s.label === active.label
                      ? "text-primary"
                      : "text-foreground",
                    // Preview the heading sizes right in the menu.
                    s.level === 1 && "text-lg font-semibold",
                    s.level === 2 && "text-base font-semibold",
                    s.level === 3 && "text-[0.95rem] font-semibold",
                    s.level === 4 && "text-sm font-semibold",
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  // Re-render the toolbar on selection/content change so active states track.
  const [, force] = useState(0);
  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-subtle/60 p-2">
      <StyleDropdown editor={editor} />

      <Divider />

      <ToolButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolButton>
      <ToolButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 className="size-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon className="size-4" />
      </ToolButton>
      <ToolButton
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="size-4" />
      </ToolButton>
      <ToolButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="size-4" />
      </ToolButton>
    </div>
  );
}

export function RichEditor({ defaultMarkdown, onChange, id, className }: Props) {
  const editor = useEditor({
    immediatelyRender: false, // SSR-safe (Next App Router)
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        // Links get their own extension below so they carry proper attributes.
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
    ],
    content: mdToHtml(defaultMarkdown ?? ""),
    editorProps: {
      attributes: {
        id: id ?? "",
        class:
          "prose-editor min-h-[22rem] w-full px-4 py-4 focus:outline-none",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(htmlToMarkdown(editor.getHTML()));
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "min-h-[26rem] rounded-xl border border-input bg-background",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-input bg-background focus-within:border-primary",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
