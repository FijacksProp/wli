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
  biography: string[];
};

const LEADERSHIP: TeamMember[] = [
  {
    name: "Davids Oluwaseye Ayodele",
    role: "Founder and Executive Director",
    image: "/images/team/davids-oluwaseye-ayodele.jpeg",
    biography: [
      "Davids Oluwaseye Ayodele is the Founder and Executive Director at the Wisdom Leadership Initiatives. With more than a decade of experience in Management and Leadership development for individuals and organisations, he brings strategic leadership, team cohesion, and visionary drive to the organisation.",
    ],
  },
  {
    name: "Dominic Oluwanifemi Deborah",
    role: "Deputy Director",
    image: "/images/team/dominic-oluwanifemi-deborah.jpeg",
    biography: [
      "Dominic Oluwanifemi Deborah is the Deputy Director at the Wisdom Leadership Initiatives. She brings in her years of experience as an administrator to enhance the leadership of WLI. She contributes to the organisational vision by her passionate drive for community outreaches, philanthropy, charity, and empowering vulnerable groups.",
    ],
  },
  {
    name: "Mrs David Oluwatoyin Justina",
    role: "Project Coordinator",
    image: "/images/team/oluwatoyin-justina.jpeg",
    biography: [
      "Mrs David Oluwatoyin Justina serves as the Project Coordinator for the Wisdom Leadership initiative, contributing to the planning, organisation and successful execution of programmes and initiatives.",
    ],
  },
];

const TEAM: TeamMember[] = [
  {
    name: "Miss Aburime Faithful Otiti",
    role: "Administrative Director",
    image: "/images/team/aburime-faithful-otiti.jpeg",
    biography: [
      "Miss Aburime Faithful Otiti serves as the Administrative Director of The Wisdom Place Leadership Initiative. She oversees day-to-day operations, ensuring the team runs smoothly, efficiently, and in line with its vision. She contributes to and coordinates Strategic planning and goal setting, Operations, Budgeting and resource management, Team coordination and leadership, Policy development and compliance, Communication and stakeholder relations, Problem-solving and decision-making, and Time management and organisation.",
    ],
  },
  {
    name: "Bibitayo Ojo",
    role: "Legal and Regulatory Compliance Professional",
    image: "/images/team/bibitayo-ojo.jpeg",
    biography: [
      "Bibitayo Ojo is a legal and regulatory compliance professional with experience in corporate and commercial law, data protection, risk assessment management and legal advisory.",
      "He works closely with the leadership and programme teams to ensure the organisation's activities are legally sound, transparent and accountable.",
      "With a practical and commercially minded approach, he is committed to helping vision-driven organisations and businesses build strong legal foundations so they can focus on what matters most.",
    ],
  },
  {
    name: "Joshua Olugbemi",
    role: "Learning, Innovation & Technology Manager",
    image: "/images/team/joshua-olugbemi.jpeg",
    biography: [
      "Joshua is a software developer and technology enthusiast passionate about leveraging technology to improve learning experiences, drive innovation and develop practical digital solutions. He bring skills in web development, software engineering and the integration of digital tools for effective learning.",
    ],
  },
  {
    name: "Marvelous Emmanuel Akintunde",
    role: "Outreaches & Logistics Manager",
    image: "/images/team/marvelous-emmanuel-akintunde.jpeg",
    biography: [
      "He serves as the Outreaches & Logistics Manager at The Wisdom Place, where he plays an important role in planning, coordinating, and executing outreach programmes and organizational activities.",
      "He brings skills in event planning, community engagement, logistics coordination, teamwork, resource management, and problem-solving. His commitment to excellence and effective coordination help ensure that outreach activities are well-planned and successfully executed.",
    ],
  },
  {
    name: "Aburime Mercy Lynette-obehi",
    role: "Media and Communications Manager",
    image: "/images/team/aburime-mercy-lynette-obehi.jpeg",
    biography: [
      "She is a media and communications professional skilled in creating, managing, and disseminating information across internal and external communication channels and the organization's digital platforms to enhance public engagement and visibility.",
      "Core skills include writing, editing, storytelling, digital communication, interpersonal relations, and networking.",
    ],
  },
  {
    name: "Odejide Precious Jesutomi",
    role: "Accountant and Finance and Procurement Officer",
    image: "/images/team/odejide-precious-jesutomi.jpeg",
    biography: [
      "She serves as an accountant and finance and procurement officer who helps ensure that organization manages its resources with accuracy, transparency, and accountability. She handles budgeting, bookkeeping, and financial reporting with close attention to detail, and keeps costs under control through careful planning and monitoring. On the procurement side, she plans purchases, evaluates suppliers, and negotiates contracts so that every purchase of goods and services delivers real value. Backed by strong auditing and compliance knowledge, and proficient in accounting software and Excel, she keeps the organization's records accurate and its processes in line with the required standards. Reliable, organized, and committed to integrity,",
    ],
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
        {member.biography.map((paragraph, index) => (
          <p
            key={`${member.name}-${index}`}
            className="mt-3 text-sm leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
