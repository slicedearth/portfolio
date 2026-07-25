const trackingId = document.querySelector(
  'meta[name="google-analytics-id"]',
)?.content

if (trackingId) {
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }

  const loadAnalytics = () => {
    if (document.querySelector("[data-google-analytics]")) return

    const script = document.createElement("script")
    script.async = true
    script.dataset.googleAnalytics = ""
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`
    document.head.append(script)
  }

  const scheduleAnalytics = () => {
    const timer = window.setTimeout(loadAnalytics, 4000)
    const loadOnInteraction = () => {
      window.clearTimeout(timer)
      loadAnalytics()
    }

    window.addEventListener("pointerdown", loadOnInteraction, {
      once: true,
      passive: true,
    })
    window.addEventListener("keydown", loadOnInteraction, { once: true })
  }

  window.gtag("js", new Date())
  window.gtag("config", trackingId, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    cookie_expires: 0,
  })

  document.addEventListener("click", event => {
    const link =
      event.target instanceof Element
        ? event.target.closest("[data-analytics-item]")
        : null
    const contentType = link?.getAttribute("data-analytics-type")
    const itemId = link?.getAttribute("data-analytics-item")

    if (!contentType || !itemId) return

    window.gtag?.("event", "select_content", {
      content_type: contentType,
      item_id: itemId,
      link_url: link.getAttribute("href"),
    })
  })

  if (document.readyState === "complete") {
    scheduleAnalytics()
  } else {
    window.addEventListener("load", scheduleAnalytics, { once: true })
  }
}
