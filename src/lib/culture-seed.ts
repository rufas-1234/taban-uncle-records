export const initialCultureArtists = [
  {
    slug: "pojulu-ppp",
    name: "Pojulu PPP",
    culture: "Pojulu",
    role: "Community music and culture channel",
    bio: "A public community channel that describes itself as a home for Pojulu music, history, and culture.",
    imageUrl: null,
    sourceUrl: "https://www.youtube.com/@pojuluppp",
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    slug: "lucia-hilary",
    name: "Lucia Hilary",
    culture: "Pojulu music feature",
    role: "Singer credited in the source title",
    bio: "The Pojulu PPP channel title credits Lucia Hilary on “NGAZI TI NGUNU.” This profile follows that public credit and links to the original video; no additional biography is implied.",
    imageUrl: null,
    sourceUrl: "https://www.youtube.com/watch?v=XOqkFRet3AQ",
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    slug: "boy-lax",
    name: "Boy Lax",
    culture: "Pojulu music feature",
    role: "Artist named in a channel collection",
    bio: "Pojulu PPP’s public video title names Boy Lax in a music collection. This profile preserves that publisher credit and makes no independent popularity or biographical claims.",
    imageUrl: null,
    sourceUrl: "https://www.youtube.com/watch?v=bnNj962P99k",
    featured: true,
    published: true,
    sortOrder: 1,
  },
] as const;

export const initialCultureMedia = [
  {
    title: "NGAZI TI NGUNU BY LUCIA HILARY",
    mediaType: "SONG",
    culture: "Pojulu",
    description:
      "The Pojulu PPP video title credits Lucia Hilary. This listing follows that public title and links to the channel’s original video.",
    youtubeUrl: "https://www.youtube.com/watch?v=XOqkFRet3AQ",
    sourceName: "Pojulu PPP",
    imageUrl: null,
    artistSlug: "lucia-hilary",
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    title: "Pojulu traditional dance in Juba South Sudan",
    mediaType: "PERFORMANCE",
    culture: "Pojulu",
    description:
      "A traditional dance video published on the Pojulu PPP channel, whose public description says it shares Pojulu music, history, and culture.",
    youtubeUrl: "https://www.youtube.com/watch?v=rDseg1prBsA",
    sourceName: "Pojulu PPP",
    imageUrl: null,
    artistSlug: "pojulu-ppp",
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    title: "Best Pojulu cultural songs || Pojulu music and traditional dance || South Sudan indigenous music",
    mediaType: "MUSIC_COLLECTION",
    culture: "Pojulu",
    description:
      "A Pojulu music collection published by the Pojulu PPP channel. The title and channel credit are preserved without making a popularity claim.",
    youtubeUrl: "https://www.youtube.com/watch?v=-BCE9SGY5wA",
    sourceName: "Pojulu PPP",
    imageUrl: null,
    artistSlug: "pojulu-ppp",
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    title: "BEST COLLECTION OF BOY LAX KING OF MUSIC || @pojuluppp",
    mediaType: "MUSIC_COLLECTION",
    culture: "Pojulu",
    description:
      "A music collection featured by Pojulu PPP. The channel’s title names Boy Lax; the listing does not treat the wording as a verified popularity ranking.",
    youtubeUrl: "https://www.youtube.com/watch?v=bnNj962P99k",
    sourceName: "Pojulu PPP",
    imageUrl: null,
    artistSlug: "boy-lax",
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    title: "Pojulu Culture Festival day in Juba at Rock City Playground (South Sudan)",
    mediaType: "CULTURE_STORY",
    culture: "Pojulu",
    description:
      "A Pojulu culture festival feature from Rock City Playground in Juba, published by 64 Tribes Media Production.",
    youtubeUrl: "https://www.youtube.com/watch?v=lQSjVgtWhMc",
    sourceName: "64 Tribes Media Production",
    imageUrl: null,
    artistSlug: null,
    featured: true,
    published: true,
    sortOrder: 4,
  },
] as const;

export type CultureMediaType = (typeof initialCultureMedia)[number]["mediaType"];

export type CultureArtistRecord = {
  id: string;
  slug: string;
  name: string;
  culture: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type CultureMediaRecord = {
  id: string;
  title: string;
  mediaType: CultureMediaType;
  culture: string;
  description: string;
  youtubeUrl: string | null;
  sourceName: string | null;
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  artist: Pick<CultureArtistRecord, "id" | "name"> | null;
};
