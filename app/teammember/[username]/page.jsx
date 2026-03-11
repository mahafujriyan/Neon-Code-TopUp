import Link from "next/link";
import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, QrCode } from "lucide-react";
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
import getDB from "@/lib/mongodb";
import {
  getDefaultTeamMemberProfile,
  getTeamMemberPublicUrl,
  getTeamMemberQrUrl,
  normalizeTeamMemberUsername,
  sanitizeTeamMemberProfile,
} from "@/lib/teamMemberProfile";
import { findTeamMemberByUsername } from "@/lib/teamMembers";

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

async function getTeamMember(username) {
  const normalizedUsername = normalizeTeamMemberUsername(username);
  if (!normalizedUsername) return null;

  const { db } = await getDB();
  const teamMemberDoc = await findTeamMemberByUsername(db, normalizedUsername);
  if (!teamMemberDoc) return null;

  const user = await db.collection("users").findOne({ userId: teamMemberDoc.userId });
  if (!user || user.role !== "team_member") return null;

  return {
    user,
    profile: sanitizeTeamMemberProfile(
      teamMemberDoc.profile || user.teamMemberProfile || getDefaultTeamMemberProfile(user),
      user
    ),
    publicUrl: getTeamMemberPublicUrl(normalizedUsername),
    qrUrl: getTeamMemberQrUrl(normalizedUsername),
  };
}

export default async function TeamMemberPublicPage({ params }) {
  const { username } = await params;
  const data = await getTeamMember(username);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#040814] px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-[1.8rem] border border-sky-400/15 bg-slate-950/80 p-6 text-center shadow-2xl sm:rounded-[2.4rem] sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-200/50">Not Found</p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Team member profile unavailable</h1>
          <p className="mt-4 text-slate-300">
            This public card does not exist, or the username has not been activated yet.
          </p>
        </div>
      </div>
    );
  }

  const { user, profile, publicUrl, qrUrl } = data;
  const photo = profile.avatar || user.photo || "https://i.ibb.co/kgp65LMf/profile-avater.png";
  const experience = profile.experience.length ? profile.experience : getDefaultTeamMemberProfile(user).experience;
  const projects = profile.projects.length ? profile.projects : getDefaultTeamMemberProfile(user).projects;
  const socialLinks = SOCIAL_ITEMS.filter((item) => profile.socialLinks?.[item.key]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,rgba(30,80,210,0.22),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(49,120,255,0.14),transparent_30%),linear-gradient(180deg,#020612,#071126_62%,#040813)] px-3 py-4 text-white sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:gap-6 xl:grid-cols-[340px_1fr] xl:gap-8">
        <aside className="rounded-[1.8rem] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(7,16,34,0.96),rgba(8,18,36,0.88))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6 sm:rounded-[2.2rem] lg:p-8 lg:rounded-[2.6rem]">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full border border-sky-400/40 bg-[radial-gradient(circle_at_50%_30%,rgba(50,120,255,0.25),rgba(9,16,32,0.95)_68%)] p-2 shadow-[0_0_80px_rgba(40,110,255,0.2)] sm:h-44 sm:w-44 lg:h-56 lg:w-56">
              <img src={photo} alt={profile.displayName} className="h-full w-full rounded-full object-cover" />
            </div>
            <h1 className="text-3xl font-black sm:text-4xl">{profile.displayName}</h1>
            <p className="mt-3 text-base text-sky-300 sm:text-lg">{profile.headline || "Verified Team Member"}</p>
          </div>

          <div className="mt-8 space-y-4">
            <Badge icon={BriefcaseBusiness} label={profile.employeeCode || user.userId.slice(-8)} value={profile.department || "Neon Team"} />

            <div className="rounded-[1.4rem] border border-sky-400/15 bg-slate-900/65 p-4 sm:rounded-[1.8rem] sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100/45">Scan To Connect</p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={publicUrl} className="text-lg font-bold text-sky-300 sm:text-xl">
                    Share Profile
                  </Link>
                  <p className="mt-2 text-sm text-slate-300">QR opens your Neon Code team page directly.</p>
                </div>
                <img src={qrUrl} alt="QR code" className="h-24 w-24 self-center rounded-2xl bg-white p-2 sm:self-auto" />
              </div>
            </div>

            {socialLinks.length ? (
              <div className="rounded-[1.4rem] border border-sky-400/15 bg-slate-900/65 p-4 sm:rounded-[1.8rem] sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100/45">Connect</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.key}
                      href={profile.socialLinks[item.key]}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/15 bg-slate-950/70 text-sky-200 transition hover:border-sky-300/30 hover:text-white"
                      aria-label={item.label}
                    >
                      <item.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="rounded-[1.8rem] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(7,16,34,0.96),rgba(8,18,36,0.88))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6 sm:rounded-[2.2rem] lg:p-8 lg:rounded-[2.6rem]">
          <div className="mb-8 flex items-center gap-3 text-sky-100/70">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">✓</span>
            Verified Employee
          </div>

          <h2 className="text-3xl font-black sm:text-4xl">{profile.company || "Neon Code"}</h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <InfoCard icon={Phone} label="Phone" value={profile.phone || "Not provided"} href={profile.phone ? `tel:${profile.phone}` : ""} />
            <InfoCard icon={Mail} label="Email" value={profile.publicEmail || "Not provided"} href={profile.publicEmail ? `mailto:${profile.publicEmail}` : ""} />
            <InfoCard icon={MapPin} label="Location" value={profile.location || "Not provided"} />
            <InfoCard icon={Globe} label="Website" value={profile.website || "Not provided"} href={profile.website || ""} />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
            <section className="space-y-8">
              <ContentBlock title="About">
                <p className="max-w-3xl text-base leading-8 text-slate-200/92 sm:text-lg sm:leading-9">
                  {profile.about || "This team member has not added a public introduction yet."}
                </p>
              </ContentBlock>

              <ContentBlock title="Skills">
                <div className="flex flex-wrap gap-3">
                  {(profile.skills.length ? profile.skills : ["Team Member"]).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-2xl border border-sky-400/18 bg-slate-900/65 px-4 py-2 text-sm font-medium text-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ContentBlock>

              {socialLinks.length ? (
                <ContentBlock title="Social Links">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.key}
                        href={profile.socialLinks[item.key]}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-w-0 items-center gap-4 rounded-[1.4rem] border border-sky-400/15 bg-slate-900/55 p-4 transition hover:border-sky-300/25 sm:rounded-[1.8rem]"
                      >
                        <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                          <item.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.18em] text-sky-100/45">{item.label}</p>
                          <p className="mt-1 truncate text-base font-semibold text-slate-100">{profile.socialLinks[item.key]}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </ContentBlock>
              ) : null}

              <ContentBlock title="Projects">
                <div className="space-y-4">
                  {(projects.length ? projects : [{ title: "Project details coming soon", description: "" }]).map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-[1.4rem] border border-sky-400/15 bg-slate-900/55 p-4 sm:rounded-[1.8rem] sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-bold sm:text-2xl">{item.title || "Untitled project"}</h3>
                        {item.duration ? (
                          <span className="rounded-xl border border-sky-400/15 px-3 py-1 text-sm text-sky-100/75">
                            {item.duration}
                          </span>
                        ) : null}
                      </div>
                      {item.company ? <p className="mt-2 text-sky-300">{item.company}</p> : null}
                      {item.description ? <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{item.description}</p> : null}
                    </div>
                  ))}
                </div>
              </ContentBlock>
            </section>

            <section className="space-y-8">
              <ContentBlock title="Experience">
                <div className="space-y-8">
                  {(experience.length ? experience : [{ title: "Experience details coming soon", company: "", duration: "", description: "" }]).map(
                    (item, index) => (
                      <div key={`${item.title}-${index}`} className="relative pl-6 sm:pl-8">
                        <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(79,160,255,0.9)]" />
                        <div className="absolute left-[5px] top-5 h-[calc(100%+1rem)] w-px bg-sky-400/25 last:hidden" />
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold sm:text-2xl">{item.title || "Experience"}</h3>
                            {item.company ? <p className="mt-2 text-lg text-slate-300 sm:text-xl">{item.company}</p> : null}
                          </div>
                          {item.duration ? (
                            <span className="rounded-xl border border-sky-400/15 bg-slate-900/65 px-4 py-2 text-sm text-sky-100/75">
                              {item.duration}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{item.description}</p> : null}
                      </div>
                    )
                  )}
                </div>
              </ContentBlock>

              <ContentBlock title="Profile Link">
                <div className="rounded-[1.4rem] border border-sky-400/15 bg-slate-900/55 p-4 sm:rounded-[1.8rem] sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-sky-300">
                    <QrCode size={18} />
                    neoncode.co public route
                  </div>
                  <p className="break-all text-base text-slate-200">{publicUrl}</p>
                </div>
              </ContentBlock>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-[1.4rem] border border-sky-400/15 bg-slate-900/65 p-4 sm:rounded-[1.8rem] sm:p-5">
      <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-100/40">{label}</p>
        <p className="mt-1 break-words text-xl text-slate-100 sm:text-2xl">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, href = "" }) {
  const content = (
    <div className="flex h-full min-w-0 items-center gap-4 rounded-[1.4rem] border border-sky-400/15 bg-slate-900/50 p-4 transition hover:border-sky-300/25 sm:rounded-[1.8rem] sm:p-5">
      <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-sky-100/45">{label}</p>
        <p className="mt-1 break-words text-lg font-bold text-slate-100 sm:text-xl">{value}</p>
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

function ContentBlock({ title, children }) {
  return (
    <section className="border-t border-sky-400/12 pt-6 sm:pt-8">
      <h3 className="mb-5 text-sm font-black uppercase tracking-[0.25em] text-sky-100/60">{title}</h3>
      {children}
    </section>
  );
}
