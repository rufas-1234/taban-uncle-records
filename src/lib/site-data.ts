export type Service = {
  slug: string;
  title: string;
  category: string;
  description: string;
  blurb: string;
  deliverables: string[];
};

export type PortfolioItem = {
  title: string;
  category: string;
  type: "music" | "photography" | "videography";
  description: string;
  image: string;
};

export type ArtistProfile = {
  name: string;
  role: string;
  focus: string;
  bio: string;
  accent: string;
};

export const services: Service[] = [
  {
    slug: "music-recording",
    title: "Music Recording",
    category: "Audio",
    description: "Professional studio recording for singles, albums, voice performances, and artist demos.",
    blurb: "Warm rooms, precise engineering, and confident sessions designed for artists ready to capture their sound.",
    deliverables: ["Session planning", "Multi-track capture", "Artist direction", "Session review"],
  },
  {
    slug: "music-production",
    title: "Music Production",
    category: "Audio",
    description: "Creative production support from arrangement to final mix, helping artists shape cohesive musical direction.",
    blurb: "Structured production planning, tonal sculpting, and collaboration from rehearsal to release-ready polish.",
    deliverables: ["Arrangement support", "Beat and arrangement design", "Creative direction", "Production notes"],
  },
  {
    slug: "audio-editing",
    title: "Audio Editing",
    category: "Audio",
    description: "Clean edits, vocal tuning, comping, and detail-focused audio cleanup for polished performances.",
    blurb: "Precision editing for podcasts, voice work, songs, and spoken-word projects needing clarity and cohesion.",
    deliverables: ["Vocal cleanup", "Comping", "Noise reduction", "Editing pass"],
  },
  {
    slug: "mixing-mastering",
    title: "Mixing & Mastering",
    category: "Audio",
    description: "Balanced mixes and final mastering that hold up across playback systems and streaming platforms.",
    blurb: "From dynamic balance to loudness and tone consistency, final output is built for playback confidence.",
    deliverables: ["Mix balancing", "Stem review", "Mastering polish", "Distribution prep"],
  },
  {
    slug: "photography",
    title: "Photography",
    category: "Visual",
    description: "Editorial, corporate, artistic, and event photography with a refined visual point of view.",
    blurb: "Candid storytelling and polished compositions for brands, people, and memorable milestones.",
    deliverables: ["Creative direction", "Shoot planning", "Retouching", "Final gallery"],
  },
  {
    slug: "portrait-photography",
    title: "Portrait Photography",
    category: "Visual",
    description: "Personal portraits and brand-led lifestyle imagery built to feel natural, cinematic, and confident.",
    blurb: "Every portrait session is designed to capture personality while staying elevated and professionally framed.",
    deliverables: ["Portrait session", "Lighting direction", "Edit selection", "Delivery set"],
  },
  {
    slug: "event-photography",
    title: "Event Photography",
    category: "Visual",
    description: "Timely event coverage for launches, community gatherings, performances, and celebrations.",
    blurb: "We document atmosphere and human moments with clean, narrative-driven coverage from start to finish.",
    deliverables: ["Coverage plan", "On-site shooting", "Highlights selection", "Gallery delivery"],
  },
  {
    slug: "videography",
    title: "Videography",
    category: "Visual",
    description: "Cinematic video coverage for events, interviews, campaigns, and memorable storytelling moments.",
    blurb: "Movement, mood, and structure are balanced to create video that feels immersive and intentional.",
    deliverables: ["Shoot planning", "Production capture", "Editing story", "Delivery package"],
  },
  {
    slug: "music-video-production",
    title: "Music Video Production",
    category: "Visual",
    description: "Concept-driven music videos that translate the energy of a track into a visual identity.",
    blurb: "From moodboards to final edit, the process creates visuals that support both artist identity and storytelling.",
    deliverables: ["Concept pitch", "Location planning", "Shooting", "Post-production"],
  },
  {
    slug: "event-video-production",
    title: "Event Video Production",
    category: "Visual",
    description: "Live event storytelling with clean capture, direct coverage, and polished post-production.",
    blurb: "We structure the story of an event so the audience feels the energy, atmosphere, and impact.",
    deliverables: ["Event coverage", "Highlight selection", "Edit workflow", "Final render"],
  },
  {
    slug: "promotional-content",
    title: "Promotional & Commercial Content",
    category: "Visual",
    description: "Short-form marketing content, social campaigns, and brand storytelling assets built to convert attention.",
    blurb: "Content systems designed to help businesses show up clearly, consistently, and confidently online.",
    deliverables: ["Creative concept", "Production plan", "Shot list", "Campaign asset pack"],
  },
  {
    slug: "other-creative-services",
    title: "Other Creative Services",
    category: "Studio",
    description: "Flexible creative support for branded content, artist packages, and one-off production requests.",
    blurb: "Custom support for projects that need creative clarity, production execution, or polished delivery.",
    deliverables: ["Project scoping", "Production support", "Creative collaboration", "Delivery review"],
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Sound of Juba",
    category: "Music Production",
    type: "music",
    description: "A local artist showcase built around layered instruments and atmospheric storytelling.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "City Frames",
    category: "Photography",
    type: "photography",
    description: "Candid portraits and district-wide storytelling through natural light and strong composition.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Gathering in Motion",
    category: "Videography",
    type: "videography",
    description: "A community-centered event video capturing movement, sound, and human connection.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Rhythm & Pulse",
    category: "Music Video",
    type: "videography",
    description: "An artist-led music video blending performance footage with cinematic city visuals.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Studio Portraits",
    category: "Portraits",
    type: "photography",
    description: "Studio portraits with warm light, subtle styling, and an art-directed visual finish.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "After Hours Session",
    category: "Recording",
    type: "music",
    description: "A nighttime session exploring intimate vocal textures and performance-led arrangement choices.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const artists: ArtistProfile[] = [
  {
    name: "Taban Uncle",
    role: "Creative Director",
    focus: "Recording, production direction, visual branding",
    bio: "Leads the studio’s artistic vision with an eye for authentic storytelling, polished production, and strong performer identity.",
    accent: "Gold",
  },
  {
    name: "Aminah J",
    role: "Production & Audio Engineer",
    focus: "Mixing, mastering, session capture",
    bio: "Transforms raw recordings into detail-rich final mixes with calm precision and creative confidence.",
    accent: "Warmth",
  },
  {
    name: "Kwame D",
    role: "Videographer",
    focus: "Event coverage, social content, branded films",
    bio: "Builds moving visual stories by shaping atmosphere, rhythm, and narrative detail in every frame.",
    accent: "Cinematic",
  },
];

export const testimonials = [
  {
    quote:
      "The studio felt organized, creative, and deeply professional from the first session to final delivery.",
    author: "Local artist",
  },
  {
    quote:
      "We needed a content partner who could balance quality with the pace of a live production schedule; this was a strong fit.",
    author: "Brand client",
  },
  {
    quote:
      "The final mix and visual treatment made the project feel premium and ready for public release.",
    author: "Event organizer",
  },
];

export const stats = [
  { label: "Creative services", value: "12+" },
  { label: "Production support", value: "24/7" },
  { label: "Client delivery model", value: "End-to-end" },
  { label: "Studio focus", value: "Juba" },
];

export const team = [
  { name: "Taban Uncle", title: "Creative Director" },
  { name: "Aminah J", title: "Audio Producer" },
  { name: "Kwame D", title: "Visual Storyteller" },
  { name: "Studio Ops", title: "Client & Booking Coordinator" },
];

export const capabilityHighlights = [
  "Music recording and production support",
  "Photography and videography coverage",
  "Client project tracking and delivery",
  "Creative campaign planning and asset delivery",
  "Booking management and consultation",
  "Content-ready file organization",
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Visual collections", href: "/collections" },
  { label: "Artists", href: "/artists" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];
