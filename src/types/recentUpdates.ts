export type recentUpdates = {
  id: number;
  kind: string;
  comment?: string;
  timestamp: string;
  data?: {
    title?: string;
    key?: string;
  };
};