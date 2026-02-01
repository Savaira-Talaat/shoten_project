//work car l'api qui nom les livre comme ça, genre oeuvre
export type Work = {
  title: string;
  description?: string | { value: string };
  authors?: {
    author: {key: string;};
  }[];
};

export type WikiData = {
  extract?: string; // résumé
  originalimage?: {
    source: string; // image HD
  };
  content_urls?: {
    desktop?: {
      page: string; // lien Wikipedia
    };
  };
};