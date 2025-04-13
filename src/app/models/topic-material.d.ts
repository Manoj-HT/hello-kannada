type MaterialBlock =
    | HeadingBlock
    | TextBlock
    | VocabBlock
    | TranslationBlock
    | ImageBlock
    | AudioBlock
    | CalloutBlock
    | ListBlock
    | TableBlock;

// ───────────────────────────────
// Individual Block Definitions
// ───────────────────────────────

type HeadingBlock = {
    type: "heading";
    data: string;
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type TextBlock = {
    type: "text";
    data: string;
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type VocabBlock = {
    type: "vocab";
    data: {
        word: string;
        transliteration?: string;
        meaning: string;
    };
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type TranslationBlock = {
    type: "translation";
    data: {
        en: string;
        kn: string;
    };
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type ImageBlock = {
    type: "image";
    data: {
        src: string;
        alt?: string;
    };
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type AudioBlock = {
    type: "audio";
    data: {
        src: string;
        label?: string;
    };
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type CalloutBlock = {
    type: "callout";
    data: string;
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type ListBlock = {
    type: "list";
    data: string[];
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type TableBlock = {
    type: "table";
    data: {
        headers: string[];
        rows: string[][];
    };
    style?: "normal" | "boxed" | "highlighted";
    important?: boolean;
    id?: string;
};

type TopicMaterial = {
    id: string;
    name: string;
    blocks: MaterialBlock[];
};
