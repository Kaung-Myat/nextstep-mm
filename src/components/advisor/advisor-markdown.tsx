import { memo, type ReactNode } from "react";

import { cn } from "@/lib/utils";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("***") && token.endsWith("***")) {
      nodes.push(
        <strong key={key} className="font-semibold italic text-[color:var(--color-text)]">
          {token.slice(3, -3)}
        </strong>,
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-[color:var(--color-text)]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md bg-[color:var(--color-panel)] px-1.5 py-0.5 font-mono text-[0.85em] text-[color:var(--color-accent)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(token);
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isListItem(line: string) {
  return /^(\s*)([-*+]|\d+\.)\s+/.test(line);
}

function isRule(line: string) {
  return /^-{3,}\s*$/.test(line.trim());
}

function headingMatch(line: string) {
  return /^(#{1,3})\s+/.test(line);
}

function AdvisorMarkdownComponent({ content, className }: { content: string; className?: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (isRule(line)) {
      blocks.push(<hr key={`hr-${blockKey++}`} className="my-3 border-0 border-t border-dashed border-[color:var(--color-line-strong)]" />);
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const Tag = level === 1 ? "h3" : level === 2 ? "h4" : "h5";
      blocks.push(
        <Tag
          key={`h-${blockKey++}`}
          className={cn(
            "font-semibold tracking-tight text-[color:var(--color-text)]",
            level === 1 && "mt-3 text-[1.15rem]",
            level === 2 && "mt-2.5 text-[1.05rem]",
            level === 3 && "mt-2 text-[0.98rem]",
          )}
        >
          {renderInline(text, `h${blockKey}`)}
        </Tag>,
      );
      i += 1;
      continue;
    }

    if (isListItem(line)) {
      const items: string[] = [];
      const ordered = /^\s*\d+\./.test(line);
      while (i < lines.length && isListItem(lines[i])) {
        items.push(lines[i].replace(/^(\s*)([-*+]|\d+\.)\s+/, ""));
        i += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={`l-${blockKey++}`}
          className={cn(
            "my-2 space-y-1 pl-5 text-[15px] leading-7 text-[color:var(--color-text)]",
            ordered ? "list-decimal" : "list-disc",
          )}
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `li-${blockKey}-${itemIndex}`)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !headingMatch(lines[i]) &&
      !isListItem(lines[i]) &&
      !isRule(lines[i])
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${blockKey++}`} className="my-2 text-[15px] leading-7 text-[color:var(--color-text)] first:mt-0">
        {renderInline(paragraph.join(" "), `p-${blockKey}`)}
      </p>,
    );
  }

  return <div className={cn("advisor-md", className)}>{blocks}</div>;
}

export const AdvisorMarkdown = memo(AdvisorMarkdownComponent);
