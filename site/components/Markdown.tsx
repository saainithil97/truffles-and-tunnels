import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { MermaidBlock } from "./MermaidBlock";

// Custom code renderer:
//   ```mermaid ... ``` → client-rendered diagram
//   anything else      → falls through to rehype-highlight
const components: Components = {
  code({ className, children, ...rest }) {
    const lang = /language-(\w+)/.exec(className ?? "")?.[1];
    if (lang === "mermaid") {
      return <MermaidBlock source={String(children).trim()} />;
    }
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
};

export function Markdown({ source }: { source: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          // rehypeRaw lets inline <svg>...</svg> in the markdown render as real
          // SVG instead of being escaped. Must run before highlight so it sees
          // the raw nodes first.
          rehypeRaw,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
