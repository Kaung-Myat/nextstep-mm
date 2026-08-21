export type AdvisorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type RecommendedAction = {
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
};
