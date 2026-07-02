export interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading"
    | "list"
    | "code"
    | "table"
    | "quote"
    | "divider"
    | "embed"
    | "mermaid"
    | "math" // KaTeX formula
    | "accordion"
    | "tabs"
    | "timeline"
    | "toc";
  data: any;
}

export type BlockType = Block["type"];
