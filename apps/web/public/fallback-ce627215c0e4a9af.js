self.fallback = async (e) => {
  const { destination: a, url: n } = e,
    c = {
      document: !1,
      image: "/images/fallback.png",
      audio: !1,
      video: !1,
      font: !1,
    }[a]
  return c ? caches.match(c, { ignoreSearch: !0 }) : Response.error()
}
