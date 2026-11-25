import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const TITLE = "Our Team — Wisdom Leadership Initiatives";
const DESCRIPTION =
  "Meet the people leading and supporting Wisdom Leadership Initiatives.";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  biography: string;
};

const LEADERSHIP: TeamMember[] = [
  {
    name: "Davids Oluwaseye Ayodele",
    role: "Founder & Executive Director",
    image: "/images/team/davids-oluwaseye-ayodele.jpeg",
    biography:
      "Davids leads Wisdom Leadership Initiatives. He brings more than a decade of experience in management and leadership development for individuals and organisations, with a focus on strategic leadership, team cohesion and organisational vision.",
  },
  {
    name: "Dominic Oluwanifemi Deborah",
    role: "Deputy Director",
    image: "/images/team/dominic-oluwanifemi-deborah.jpeg",
    biography:
      "Dominic brings administrative experience to WLI’s leadership. She champions community outreach, philanthropy and support for vulnerable groups.",
  },
  {
    name: "Mrs David Oluwatoyin Justina",
    role: "Project Coordinator",
    image: "/images/team/oluwatoyin-justina.jpeg",
    biography:
      "Justina coordinates the planning, organisation and delivery of WLI programmes and initiatives.",
  },
];

const TEAM: TeamMember[] = [
  {
    name: "Miss Aburime Faithful Otiti",
    role: "Administrative Director",
    image: "/images/team/aburime-faithful-otiti.jpeg",
    biography:
      "Faithful oversees day-to-day operations and supports strategic planning, resource management, team coordination, policy development and stakeholder relations.",
  },
  {
    name: "Bibitayo Ojo",
    role: "Legal & Regulatory Compliance",
    image: "/images/team/bibitayo-ojo.jpeg",
    biography:
      "Bibitayo works across corporate and commercial law, data protection, risk assessment and legal advisory. He supports WLI’s leadership and programme teams to keep the organisation’s activities legally sound, transparent and accountable.",
  },
  {
    name: "Joshua Olugbemi",
    role: "Learning, Innovation & Technology Manager",
    image: "/images/team/joshua-olugbemi.jpeg",
    biography:
      "Joshua develops practical digital solutions and explores how technology can improve learning experiences. His background includes web development and software engineering.",
  },
  {
    name: "Marvelous Emmanuel Akintunde",
    role: "Outreaches & Logistics Manager",
    image: "/images/team/marvelous-emmanuel-akintunde.jpeg",
    biography:
      "Marvelous plans and coordinates outreach programmes and organisational activities, drawing on his experience in event planning, community engagement and logistics.",
  },
  {
    name: "Aburime Mercy Lynette-obehi",
    role: "Media & Communications Manager",
    image: "/images/team/aburime-mercy-lynette-obehi.jpeg",
    biography:
      "Mercy manages communications across WLI’s internal and external channels and digital platforms, helping strengthen public engagement and visibility.",
  },
  {
    name: "Odejide Precious Jesutomi",
    role: "Accountant, Finance & Procurement Officer",
    image: "/images/team/odejide-precious-jesutomi.jpeg",
    biography:
      "Precious supports budgeting, bookkeeping, financial reporting and procurement, with a focus on accuracy, transparency and responsible resource management.",
  },
];

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-purple-deep text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(130,1,207,0.45),transparent_55%)]"
        />
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <p className="eyebrow text-white/75">The people behind WLI</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.04] font-medium sm:text-6xl lg:text-7xl">
            Meet the team building a culture of principled leadership.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Our team brings together leadership, programme delivery,
            administration and specialist skills in service of positive change.
          </p>
          <Button asChild variant="outline-inverse" className="mt-8">
            <Link to="/about">
              <ArrowLeft aria-hidden /> Back to About WLI
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Leadership"
          title="Guiding the work"
          intro="The leaders shaping WLI’s direction and coordinating its programmes."
        />
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...LEADERSHIP, ...TEAM].map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <Link
          to="/about"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden /> Learn more about WLI
        </Link>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight font-medium text-purple sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        {intro}
      </p>
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="aspect-[4/5] overflow-hidden bg-purple-50">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          {member.role}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug font-medium text-purple">
          {member.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {member.biography}
        </p>
      </div>
    </article>
  );
}
