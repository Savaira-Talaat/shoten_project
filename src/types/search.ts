export type SearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
};

export type AdvancedSearchFilters = {
  title: string;
  author: string;
  subject: string;
  publisher: string;
  year: string;
};

export type SearchResponse = {
  numFound?: number;
  docs?: SearchDoc[];
};
