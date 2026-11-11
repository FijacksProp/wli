/**
 * Single source of site content. Every unconfirmed fact is a visible "[...]" placeholder
 * so it can be found (search for "[") and replaced before launch.
 */

export const ORG = {
  name: "Wisdom Leadership Initiatives",
  shortName: "WLI",
  alias: "The Wisdom Place",
  tagline: "Wisdom, Strategies and Coaching for Leaders",
  vision: "To equip, empower, and deploy leaders that will be agents of societal change.",
  mission: [
    "Develop people and societal capabilities by strengthening people’s ability to lead themselves and their societies.",
    "Recruit and empower emerging leaders to solve pressing societal problems, contributing to positive change in communities, institutions, and social systems.",
    "Train and equip people with knowledge for personal transformation and, by extension, societal development.",
  ],
  description:
    "Wisdom Leadership Initiatives (The Wisdom Place) develops principled leaders who contribute to positive change in their communities and society.",
  email: "thewisdomplaceonline@gmail.com",
  phones: ["+2347030278454", "+2348065187048"],
  socials: [{ name: "Facebook", url: "https://web.facebook.com/WisdomLeadershipInitiatives/about/" }],
  location: "[Location to be confirmed]",
} as const;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About WLI" },
  { to: "/what-we-do", label: "What We Do" },
  { to: "/programs", label: "Programs" },
  { to: "/insights", label: "Insights & Resources" },
  { to: "/contact", label: "Contact" },
] as const;

export const VALUES = [
  {
    name: "Chokmah (Wisdom)",
    body: "Chokmah is the Hebrew word for wisdom. For us, it means wisdom that empowers others and builds society — not knowledge kept for oneself.",
    featured: true,
  },
  { name: "Leadership", body: "Learning to lead ourselves well, so we can lead and serve others." },
  { name: "Impact", body: "Leadership measured by the positive change it brings to people and places." },
  {
    name: "Personal & Community Empowerment",
    body: "Strengthening individuals and the communities they belong to.",
  },
  { name: "Growth & Development", body: "Continuous learning for personal transformation." },
  {
    name: "Societal Transformation",
    body: "Leaders who become agents of change in communities, institutions and social systems.",
  },
] as const;

export type ServiceArea = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  related?: { label: string; slug?: string; to?: "/insights" };
};

export const SERVICES: ServiceArea[] = [
  {
    id: "training",
    title: "Leadership training & workshops",
    summary: "Practical training that strengthens people’s ability to lead themselves and their societies.",
    detail:
      "We train and equip people with knowledge for personal transformation and, by extension, societal development — building the character and judgment that principled leadership requires.",
  },
  {
    id: "seminars",
    title: "Seminars & conferences",
    summary: "Gatherings where emerging leaders learn, reflect and grow together.",
    detail:
      "Our seminars and conferences bring leaders together around shared learning. They include The Next Gen Leadership Conference for secondary school students.",
    related: { label: "The Next Gen Leadership Conference", slug: "next-gen-leadership-conference" },
  },
  {
    id: "mentoring",
    title: "Mentoring & coaching",
    summary: "Wisdom, strategies and coaching that support leaders in their personal growth.",
    detail:
      "Through mentoring and coaching we support strong character, sound judgment and purposeful leadership. House of Insights offers a weekly virtual forum for young leaders.",
    related: { label: "House of Insights (HOI)", slug: "house-of-insights" },
  },
  {
    id: "outreach",
    title: "Community outreach, sponsorship & empowerment",
    summary: "Personal and community empowerment, including educational support.",
    detail:
      "We reach into communities to empower people. Through The Mordecai Project we provide educational support for students and people who cannot afford school fees.",
    related: { label: "The Mordecai Project", slug: "mordecai-project" },
  },
  {
    id: "placement",
    title: "Leadership placement opportunities",
    summary: "Recruiting and empowering emerging leaders to help solve pressing societal problems.",
    detail:
      "We recruit and empower emerging leaders to contribute to positive change in communities, institutions and social systems. [Placement process and details to be confirmed]",
  },
  {
    id: "resources",
    title: "Leadership resources",
    summary: "Books, articles, blogs and videos for leaders who keep learning.",
    detail:
      "Our resources extend learning beyond our programs, with books, articles, blogs, audio and video messages on leadership and personal growth.",
    related: { label: "Insights & Resources", to: "/insights" },
  },
];

export type Program = {
  slug: string;
  name: string;
  short?: string;
  format: string;
  summary: string;
  overview: string[];
  audience: string;
  expect: string[];
  confirmed: boolean;
  photoLabel: string;
};

export const PROGRAMS: Program[] = [
  {
    slug: "house-of-insights",
    name: "House of Insights",
    short: "HOI",
    format: "Weekly · Virtual forum",
    summary:
      "A weekly virtual forum where young leaders gather to learn, reflect, and grow.",
    overview: [
      "House of Insights (HOI) is a weekly virtual forum where young leaders gather to learn, reflect, and grow.",
      "Sessions offer practical life wisdom to support strong character, sound judgment, and purposeful leadership.",
    ],
    audience: "Young leaders",
    expect: [
      "A weekly virtual gathering with other young leaders",
      "Time to learn, reflect and grow together",
      "Practical life wisdom you can apply",
      "Support for strong character, sound judgment and purposeful leadership",
    ],
    confirmed: true,
    photoLabel: "[HOI session photo to be supplied]",
  },
  {
    slug: "next-gen-leadership-conference",
    name: "The Next Gen Leadership Conference",
    format: "Conference",
    summary:
      "A conference for secondary school students on leading themselves and others with confidence and integrity.",
    overview: [
      "The Next Gen Leadership Conference is for secondary school students. It focuses on leading themselves and others with confidence and integrity.",
      "It aims to raise capable leaders committed to building a better society.",
    ],
    audience: "Secondary school students",
    expect: [
      "Mindset development",
      "Self-leadership training",
      "Learning to lead yourself and others with confidence and integrity",
    ],
    confirmed: true,
    photoLabel: "[Conference photo to be supplied]",
  },
  {
    slug: "mordecai-project",
    name: "The Mordecai Project",
    format: "Charitable platform",
    summary:
      "Educational support for students and people who cannot afford school fees.",
    overview: [
      "The Mordecai Project is a charitable platform that provides educational support for students and people who cannot afford school fees.",
      "It helps open access to learning and opportunity.",
    ],
    audience: "Students and people who cannot afford school fees",
    expect: [
      "Educational support for those unable to afford school fees",
      "Wider access to learning and opportunity",
      "[Eligibility and support details to be confirmed]",
    ],
    confirmed: true,
    photoLabel: "[Mordecai Project photo to be supplied]",
  },
  {
    slug: "the-wisdom-place",
    name: "The Wisdom Place",
    format: "[Format to be confirmed]",
    summary: "[Program description to be confirmed]",
    overview: ["[Program description to be confirmed]"],
    audience: "[Intended audience to be confirmed]",
    expect: ["[Program details to be confirmed]"],
    confirmed: false,
    photoLabel: "[Program photo to be supplied]",
  },
];

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);

export type ResourceCategory =
  | "Success Scrolls"
  | "Program testimonials"
  | "Articles & blog"
  | "Books"
  | "Audio messages"
  | "Video messages";

export const RESOURCE_CATEGORIES: { id: string; name: ResourceCategory; blurb: string }[] = [
  { id: "success-scrolls", name: "Success Scrolls", blurb: "Stories of growth from our community." },
  {
    id: "testimonials",
    name: "Program testimonials",
    blurb: "Reflections from people who have taken part in our programs.",
  },
  { id: "articles", name: "Articles & blog", blurb: "Writing on leadership, wisdom and personal growth." },
  { id: "books", name: "Books", blurb: "Books for leaders who keep learning." },
  { id: "audio", name: "Audio messages", blurb: "Listen to teaching and conversations on leadership." },
  { id: "video", name: "Video messages", blurb: "Watch sessions and messages on leadership." },
];

export type Resource = {
  slug: string;
  category: ResourceCategory;
  title: string;
  excerpt: string;
  meta: string;
  media?: "audio" | "video";
};

export const RESOURCES: Resource[] = [
  {
    slug: "success-scroll-1",
    category: "Success Scrolls",
    title: "[Success Scroll title to be supplied]",
    excerpt: "[Approved story summary to be supplied]",
    meta: "[Date to be supplied]",
  },
  {
    slug: "testimonial-1",
    category: "Program testimonials",
    title: "[Approved testimonial to be supplied]",
    excerpt: "[Participant name, program and consented quote to be supplied]",
    meta: "[Program to be supplied]",
  },
  {
    slug: "article-1",
    category: "Articles & blog",
    title: "[Article title to be supplied]",
    excerpt: "[Article summary to be supplied]",
    meta: "[Author · Date to be supplied]",
  },
  {
    slug: "article-2",
    category: "Articles & blog",
    title: "[Article title to be supplied]",
    excerpt: "[Article summary to be supplied]",
    meta: "[Author · Date to be supplied]",
  },
  {
    slug: "book-1",
    category: "Books",
    title: "[Book title to be supplied]",
    excerpt: "[Book description to be supplied]",
    meta: "[Author to be supplied]",
  },
  {
    slug: "audio-1",
    category: "Audio messages",
    title: "[Audio message title to be supplied]",
    excerpt: "[Audio summary to be supplied]",
    meta: "[Speaker · Length to be supplied]",
    media: "audio",
  },
  {
    slug: "video-1",
    category: "Video messages",
    title: "[Video message title to be supplied]",
    excerpt: "[Video summary to be supplied]",
    meta: "[Speaker · Length to be supplied]",
    media: "video",
  },
];

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);

/** Replace each entry with approved name, title, bio and photo when supplied. */
export const TEAM = [1, 2, 3, 4].map((n) => ({
  id: `member-${n}`,
  name: "[Name to be supplied]",
  title: "[Title to be supplied]",
  bio: "[Short bio to be supplied]",
  photo: null as string | null,
}));
