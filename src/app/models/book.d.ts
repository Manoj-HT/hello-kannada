type ChapterType = "material" | "interactive" | "game";

type ChapterSummary = {
  id: string; // format: bookID:chapterID
  title: string;
  description?: string;
  type: ChapterType;
  link: string;
};

type Book = {
  id: string;
  name: string;
  description?: string;
  chapters: ChapterSummary[];
};
