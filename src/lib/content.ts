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
} as const;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About WLI" },
  { to: "/what-we-do", label: "What We Do" },
  { to: "/programs", label: "Program & Resources" },
  { to: "/insights", label: "Insights (Blog)" },
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
      "We recruit and empower emerging leaders to contribute to positive change in communities, institutions and social systems.",
  },
  {
    id: "resources",
    title: "Leadership resources",
    summary: "Books, articles, blogs and videos for leaders who keep learning.",
    detail:
      "Our resources extend learning beyond our programs with books, articles, blog posts and video messages on leadership and personal growth.",
    related: { label: "Insights (Blog)", to: "/insights" },
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
    photoLabel: "House of Insights",
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
    photoLabel: "Next Gen Leadership Conference",
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
    ],
    confirmed: true,
    photoLabel: "The Mordecai Project",
  },

];

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);

export type ResourceCategory =
  | "Success Scrolls"
  | "Program testimonials"
  | "Articles & blog";

export const RESOURCE_CATEGORIES: { id: string; name: ResourceCategory; blurb: string }[] = [];

export type Resource = {
  slug: string;
  category: ResourceCategory;
  title: string;
  excerpt: string;
  meta: string;
};

export const RESOURCES: Resource[] = [];

export const BOOKS = [
  {
    title: "31 Wisdom Keys",
    file: "31-wisdom-keys.pdf",
    category: "books",
  },
  {
    title: "The Life Assignment",
    file: "the-life-assignment.pdf",
    category: "books",
  },
  {
    title: "Wisdom for Living",
    file: "wisdom-for-living.pdf",
    category: "books",
  },
  {
    title: "Times and Seasons of Life",
    file: "times-and-seasons-of-life.pdf",
    category: "books",
  },
  {
    title: "Confessions over Children",
    file: "confessions-over-children.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on the Anointing",
    file: "meditations-on-the-anointing.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Grace",
    file: "meditations-on-grace.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Wisdom",
    file: "meditations-on-wisdom.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Healing and Health",
    file: "meditations-on-healing-and-health.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Favour",
    file: "meditations-on-favour.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Prosperity",
    file: "meditations-on-prosperity.pdf",
    category: "meditation_booklets",
  },
  {
    title: "Meditations on Selflessness",
    file: "meditations-on-selflessness.pdf",
    category: "meditation_booklets",
  },
] as const;

export const VIDEO_MESSAGES = [
  { title: "Wisdom of Order", id: "NJbDLKS3M1A" },
  { title: "Wisdom of Automation", id: "mjZdtSNZJl0" },
  { title: "The Wisdom of Growth", id: "jM9oDbRfxlg" },
  { title: "The Lifted Ark — Kingdom Mindset", id: "oxVdUvL2u80" },
  { title: "Shut in the Ark", id: "AufOtqZf3Lk" },
  { title: "The Lifted Ark", id: "xEFDkzUTd1k" },
] as const;

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);

