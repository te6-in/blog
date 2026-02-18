// Octokit still doesn't expose stable endpoint typings for repository discussions.
// Keep this local schema minimal and focused on fields actually used in the UI.

export type DiscussionsResponse = {
  number: number;
  title: string;
  updated_at: string;
}[];

export type DiscussionCommentsResponse = {
  created_at: string;
  body: string;
  user: {
    avatar_url: string;
  };
}[];
