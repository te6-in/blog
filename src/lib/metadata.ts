const lexicons = {
  index: { label: "홈" },
  posts: { label: "글" },
  snippets: { label: "코드 조각" },
  tags: { label: "태그" },
} as const satisfies Record<string, { label: string }>;

export const METADATA = {
  name: "te6.in 블로그",
  previousName: "te6.in 개발·디자인 블로그",
  site: "https://blog.te6.in",
  // TODO: do better
  description: "te6.in 블로그입니다. 개발 및 디자인 글을 주로 작성합니다.",
  createdAt: new Date("2022-12-22T12:00:00+09:00"),
  updatedAt: new Date(),
  lexicons,
  author: {
    name: "찬휘",
    id: "te6",
    url: "https://te6.in",
    avatar: "https://avatars.githubusercontent.com/u/56245920?v=4",
  },
  repo: {
    owner: "te6-in",
    name: "blog",
    url: "https://github.com/te6-in/blog",
  },
  discussions: {
    repo: {
      owner: "te6-in",
      name: "blog-te6-in-comments",
      id: "R_kgDOIZUGww",
      category: {
        id: "DIC_kwDOIZUGw84CTZxb",
        name: "Comments",
      },
    },
    url: "https://github.com/te6-in/blog-te6-in-comments/discussions",
  },
  social: {
    twitter: {
      username: "@te6_in",
    },
    github: {},
    mastodon: {},
    bluesky: {},
    instagram: {},
  },
  keywords: [
    "개발",
    "엔지니어링",
    "IT",
    "Software Development",
    "개발자",
    "Software Developer",
    "Software Engineering",
    "Software Engineer",
    "디자인",
    "Design",
    "Product Design",
    "UX",
    "User Experience",
    "프로그래밍",
    "블로그",
    "Blog",
  ],
} as const;
