export type ExamplePost = {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  updatedAt?: string;
  image?: string;
};

export const posts: ExamplePost[] = [
  {
    id: "1",
    title: "Example Post One",
    summary: "An example post demonstrating static metadata.",
    content: "This is the example content for post one.",
    updatedAt: "2026-03-20T12:00:00.000Z",
    image: "/og/example1.png",
  },
  {
    id: "2",
    title: "Example Post Two",
    summary: "A second example post for static export.",
    content: "This is the example content for post two.",
    updatedAt: "2026-03-19T09:00:00.000Z",
    image: "/og/example2.png",
  },
];

export function getPostById(id: string) {
  return posts.find((p) => p.id === id) || null;
}

export function getAllPostIds(): string[] {
  return posts.map((p) => p.id);
}
