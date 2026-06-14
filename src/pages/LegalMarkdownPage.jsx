import { Link } from "react-router-dom";
import "./LegalPage.css";

function renderInline(text, keyPrefix) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let idx = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a key={`${keyPrefix}-link-${idx}`} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
    idx += 1;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length ? parts : text;
}

function parseMarkdown(markdown) {
  const lines = String(markdown || "").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      i += 1;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i += 1;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraph = [trimmed];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next || next.startsWith("#") || next.startsWith("- ")) break;
      paragraph.push(next);
      i += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

export default function LegalMarkdownPage({ title, markdown, inProgress }) {
  const blocks = parseMarkdown(markdown);

  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <header className="legal-page-header">
          <h1>{title}</h1>
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </header>

        <article className="legal-page-card">
          {inProgress ? (
            <p className="legal-page-in-progress" role="status">
              In progress — wording may change before wider release.
            </p>
          ) : null}
          {blocks.map((block, index) => {
            if (block.type === "h1") return <h1 key={index}>{renderInline(block.text, `h1-${index}`)}</h1>;
            if (block.type === "h2") return <h2 key={index}>{renderInline(block.text, `h2-${index}`)}</h2>;
            if (block.type === "h3") return <h3 key={index}>{renderInline(block.text, `h3-${index}`)}</h3>;
            if (block.type === "ul") {
              return (
                <ul key={index}>
                  {block.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`}>{renderInline(item, `li-${index}-${itemIndex}`)}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{renderInline(block.text, `p-${index}`)}</p>;
          })}
        </article>
      </div>
    </div>
  );
}

