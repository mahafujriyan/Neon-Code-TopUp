import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  Download,
  Globe,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Share2,
} from "lucide-react";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { getDefaultTeamMemberProfile } from "@/lib/teamMemberProfile";
import { createVCard, getPublicTeamMemberByUsername } from "@/lib/teamMemberPublic";

export const dynamic = "force-dynamic";

const SOCIAL_ITEMS = [
  { key: "website", icon: FaGlobe, label: "Website" },
  { key: "github", icon: FaGithub, label: "GitHub" },
  { key: "twitter", icon: FaTwitter, label: "Twitter / X" },
  { key: "youtube", icon: FaYoutube, label: "YouTube" },
  { key: "dribbble", icon: FaDribbble, label: "Dribbble" },
  { key: "behance", icon: FaBehance, label: "Behance" },
  { key: "pinterest", icon: FaPinterestP, label: "Pinterest" },
  { key: "whatsapp", icon: FaWhatsapp, label: "WhatsApp" },
  { key: "linkedin", icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "telegram", icon: FaTelegramPlane, label: "Telegram" },
  { key: "instagram", icon: FaInstagram, label: "Instagram" },
  { key: "facebook", icon: FaFacebookF, label: "Facebook" },
];

export default async function TeamMemberPublicPage({ params }) {
  const { username } = await params;
  const data = await getPublicTeamMemberByUsername(username);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#071006] px-4 py-12 text-[#f4ffd8] sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d4ff4d]/20 bg-[rgba(7,17,6,0.88)] p-6 text-center shadow-[0_30px_100px_rgba(164,255,84,0.08)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#dfff84]/60">Not Found</p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Team member profile unavailable</h1>
          <p className="mt-4 text-[#dce8c6]/78">This public card does not exist or is not active yet.</p>
        </div>
      </div>
    );
  }

  const { profile, user, publicUrl, qrUrl } = data;
  const photo = profile.avatar || user.photo || "https://i.ibb.co/kgp65LMf/profile-avater.png";
  const fallback = getDefaultTeamMemberProfile(user);
  const experience = profile.experience.length ? profile.experience : fallback.experience;
  const projects = profile.projects.length ? profile.projects : fallback.projects;
  const socialLinks = SOCIAL_ITEMS.filter((item) => profile.socialLinks?.[item.key]);
  const vCard = createVCard(data);
  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(213,255,79,0.24),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(183,255,69,0.16),transparent_24%),linear-gradient(180deg,#051006_0%,#081308_36%,#071106_100%)] px-2 py-2 text-[#f7ffd8] sm:px-3 sm:py-3 lg:px-4 lg:py-4">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[4%] top-[8%] h-72 w-72 rounded-full bg-[#d4ff4d]/8 blur-3xl" />
        <div className="absolute bottom-[10%] right-[4%] h-80 w-80 rounded-full bg-[#ddff72]/10 blur-3xl" />
        <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-[#ddff72]/35 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#d8ff5d]/25 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-[1600px] flex-col overflow-hidden rounded-[2rem] border border-[#d9ff6a]/18 bg-[linear-gradient(180deg,rgba(6,14,6,0.9),rgba(5,11,5,0.82))] shadow-[0_35px_120px_rgba(0,0,0,0.45)] lg:h-[calc(100vh-2rem)] lg:flex-row lg:rounded-[2.5rem]">
        <aside className="relative border-b border-[#ddff72]/12 px-4 py-6 sm:px-6 lg:sticky lg:top-0 lg:h-full lg:w-[360px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-7 lg:py-8 xl:w-[390px]">
          <div className="mx-auto flex h-full max-w-[420px] flex-col">
            <div className="text-center">
              <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full border border-[#dbff61]/55 bg-[radial-gradient(circle_at_50%_45%,rgba(222,255,114,0.18),rgba(8,19,8,0.98)_70%)] p-[6px] shadow-[0_0_60px_rgba(211,255,87,0.28)] sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                <img src={photo} alt={profile.displayName} className="h-full w-full rounded-full object-cover" />
              </div>

              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{profile.displayName}</h1>
                <BadgeCheck className="h-7 w-7 text-[#dcff62]" />
              </div>
              <p className="mt-2 text-xl text-[#d3f066]">{profile.headline || "Verified Team Member"}</p>
            </div>

            <div className="mt-8 space-y-5">
              <GlassBadge
                icon={BriefcaseBusiness}
                primary={profile.employeeCode || user.userId.slice(-8)}
                secondary={profile.department || "Neon Code"}
              />

              <a
                href={vCardHref}
                download={`${data.username || "team-member"}.vcf`}
                className="flex min-h-14 items-center justify-center rounded-[1.55rem] border border-[#d9ff6c]/45 bg-[linear-gradient(180deg,rgba(222,255,94,0.16),rgba(181,255,68,0.05))] px-5 py-4 text-2xl font-black text-[#efffc7] shadow-[0_0_26px_rgba(195,255,90,0.18)] transition hover:border-[#ecff98]/70"
              >
                Save Contact
              </a>

              <div className="rounded-[1.55rem] border border-[#d8ff5d]/18 bg-[rgba(10,21,10,0.74)] p-4 shadow-[0_0_24px_rgba(186,255,79,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#f2ffbb]/58">Scan To Connect</p>
                    <div className="mt-4 flex items-center gap-2 text-2xl font-black text-[#d8ff67]">
                      <Share2 className="h-5 w-5" />
                      Share Profile
                    </div>
                  </div>
                  <img src={qrUrl} alt="QR code" className="h-24 w-24 rounded-2xl bg-white p-2 shadow-lg" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={qrUrl}
                    download={`${data.username}-qr.png`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8ff5d]/28 px-4 py-3 text-sm font-bold text-[#efffc8]"
                  >
                    <Download className="h-4 w-4" />
                    Download QR
                  </a>
                  <Link
                    href={publicUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d8ff5d]/12 px-4 py-3 text-sm font-bold text-[#edffc0]"
                  >
                    <QrCode className="h-4 w-4" />
                    Open Link
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={profile.socialLinks[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8ff5d]/22 bg-[rgba(16,30,13,0.82)] text-[#dffb76] shadow-[0_0_20px_rgba(195,255,89,0.06)] transition hover:border-[#ebff9b]/60 hover:text-[#fbffd6]"
                  >
                    <item.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-0 flex-1 px-4 py-6 sm:px-6 lg:overflow-y-auto lg:px-8 lg:py-8 xl:px-10">
          <div className="mx-auto max-w-5xl pb-10">
            <div className="mb-7 flex items-center gap-3 text-[#ddff73]">
              <BadgeCheck className="h-6 w-6" />
              <span className="text-base font-medium tracking-wide">Verified Employee</span>
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#fbffd7] sm:text-5xl">
              {profile.company || "Neon Code"}
            </h2>

            <div className="mt-7 grid gap-4 xl:grid-cols-2">
              <InfoCard icon={Phone} label="Phone" value={profile.phone || "Not provided"} href={profile.phone ? `tel:${profile.phone}` : ""} />
              <InfoCard icon={Mail} label="Email" value={profile.publicEmail || "Not provided"} href={profile.publicEmail ? `mailto:${profile.publicEmail}` : ""} />
              <InfoCard icon={MapPin} label="Location" value={profile.location || "Not provided"} />
              <InfoCard icon={Globe} label="Website" value={profile.website || "Not provided"} href={profile.website || ""} />
            </div>

            <div className="mt-9 grid gap-10 border-t border-[#d8ff5d]/12 pt-8 xl:grid-cols-[1.08fr_0.82fr]">
              <section className="space-y-10">
                <Section title="About">
                  <p className="max-w-3xl text-xl leading-10 text-[#eef7d0]/88">
                    {profile.about || "This team member has not added a public introduction yet."}
                  </p>
                </Section>

                <Section title="Skills">
                  <div className="flex flex-wrap gap-3">
                    {(profile.skills.length ? profile.skills : ["Team Member"]).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-2xl border border-[#dbff65]/18 bg-[rgba(18,30,15,0.72)] px-4 py-2.5 text-lg text-[#f4ffd4] shadow-[0_0_20px_rgba(185,255,75,0.04)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section title="Projects">
                  <div className="space-y-4">
                    {(projects.length ? projects : [{ title: "Project details coming soon", description: "" }]).map((item, index) => (
                      <ProjectCard
                        key={`${item.title}-${index}`}
                        title={item.title || "Untitled Project"}
                        company={item.company}
                        duration={item.duration}
                        description={item.description}
                      />
                    ))}
                  </div>
                </Section>
              </section>

              <section className="space-y-10 border-t border-[#d8ff5d]/12 pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                <Section title="Experience">
                  <div className="space-y-8">
                    {(experience.length ? experience : [{ title: "Experience details coming soon", company: "", duration: "", description: "" }]).map(
                      (item, index) => (
                        <TimelineCard
                          key={`${item.title}-${index}`}
                          title={item.title || "Experience"}
                          company={item.company}
                          duration={item.duration}
                          description={item.description}
                          isLast={index === experience.length - 1}
                        />
                      )
                    )}
                  </div>
                </Section>

                {socialLinks.length ? (
                  <Section title="Connect">
                    <div className="space-y-4">
                      {socialLinks.map((item) => (
                        <a
                          key={item.key}
                          href={profile.socialLinks[item.key]}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-w-0 items-center justify-between gap-4 rounded-[1.6rem] border border-[#d8ff5d]/18 bg-[rgba(14,24,12,0.72)] p-4 transition hover:border-[#ebff98]/42"
                        >
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.22em] text-[#dff095]/56">{item.label}</p>
                            <p className="mt-2 truncate text-lg font-bold text-[#fbffd9]">{profile.socialLinks[item.key]}</p>
                          </div>
                          <div className="rounded-2xl bg-[#d9ff64]/10 p-3 text-[#deff6a]">
                            <item.icon size={20} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </Section>
                ) : null}

                <Section title="Profile Link">
                  <div className="rounded-[1.6rem] border border-[#d8ff5d]/18 bg-[rgba(14,24,12,0.72)] p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#e0ff74]">
                      <QrCode className="h-5 w-5" />
                      neoncode.co public route
                    </div>
                    <p className="break-all text-lg text-[#f5ffd8]">{publicUrl}</p>
                  </div>
                </Section>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function GlassBadge({ icon: Icon, primary, secondary }) {
  return (
    <div className="flex items-center gap-4 rounded-[1.55rem] border border-[#d8ff5d]/20 bg-[rgba(11,22,10,0.76)] p-4 shadow-[0_0_24px_rgba(190,255,84,0.05)]">
      <div className="rounded-2xl bg-[#d8ff5d]/10 p-3 text-[#deff73]">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="break-words text-2xl font-bold text-[#f9ffd7]">{primary}</p>
        <p className="mt-1 text-xl text-[#d4ef75]">{secondary}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, href = "" }) {
  const content = (
    <div className="flex min-h-[124px] min-w-0 items-center gap-4 rounded-[1.7rem] border border-[#d8ff5d]/20 bg-[rgba(10,20,9,0.76)] px-5 py-5 shadow-[0_0_22px_rgba(196,255,82,0.05)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d8ff5d]/10 text-[#e1ff73]">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.22em] text-[#dce88a]/62">{label}</p>
        <p className="mt-2 break-words text-2xl font-bold text-[#f7ffd7]">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-5 text-sm font-black uppercase tracking-[0.28em] text-[#e6ff7d]">{title}</h3>
      {children}
    </section>
  );
}

function TimelineCard({ title, company, duration, description, isLast }) {
  return (
    <div className="relative pl-8">
      <span className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-[#ddff73] shadow-[0_0_22px_rgba(221,255,115,0.92)]" />
      {!isLast ? <span className="absolute left-[6px] top-6 h-[calc(100%+1.2rem)] w-px bg-[#d7ff5a]/28" /> : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-3xl font-black text-[#fbffd7]">{title}</h4>
          {company ? <p className="mt-3 text-2xl text-[#d6e88b]">{company}</p> : null}
        </div>
        {duration ? (
          <span className="rounded-xl border border-[#d8ff5d]/22 bg-[#d8ff5d]/10 px-4 py-2 text-sm font-bold text-[#efffb6]">
            {duration}
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-4 text-xl leading-10 text-[#edf5d3]/82">{description}</p> : null}
    </div>
  );
}

function ProjectCard({ title, company, duration, description }) {
  return (
    <div className="rounded-[1.7rem] border border-[#d8ff5d]/20 bg-[rgba(10,20,9,0.76)] p-5 shadow-[0_0_22px_rgba(196,255,82,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#d8ff5d]/10 p-3 text-[#deff73]">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <h4 className="text-2xl font-black text-[#fbffd7]">{title}</h4>
        </div>
        <ChevronRight className="h-5 w-5 text-[#dcff63]" />
      </div>
      {company ? <p className="mt-3 text-xl text-[#d6e88b]">{company}</p> : null}
      {duration ? <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#d8ef8a]/66">{duration}</p> : null}
      {description ? <p className="mt-4 text-xl leading-10 text-[#edf5d3]/82">{description}</p> : null}
    </div>
  );
}
