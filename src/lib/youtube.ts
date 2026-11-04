export function getYouTubeVideoId(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;

    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1).match(/^[\w-]{11}$/)?.[0] ?? null;
    }

    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"].includes(url.hostname)) {
      return null;
    }

    const videoId =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})$/)?.[1];

    return videoId?.match(/^[\w-]{11}$/)?.[0] ?? null;
  } catch {
    return null;
  }
}
