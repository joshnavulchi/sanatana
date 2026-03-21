export type Post = {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  updatedAt?: string;
};

const POSTS: Post[] = [
  {
    id: 'hello-world',
    title: 'Hello, world',
    summary: 'An example post used for the example route.',
    content: '<p>This is an example post used by the example route.</p>',
    image: '/og/default.jpg',
    updatedAt: new Date().toISOString(),
  },
];

export function getAllPostIds(): string[] {
  return POSTS.map((p) => p.id);
}

export function getPostById(id: string): Post | undefined {
  return POSTS.find((p) => p.id === id);
}
