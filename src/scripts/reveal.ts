const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
const revealItems = Array.from(
  document.querySelectorAll<HTMLElement>("[data-reveal]"),
)

revealItems.forEach(item => {
  const delay = Number(item.dataset.revealDelay ?? 0)
  if (!Number.isFinite(delay) || delay <= 0) return
  item.style.setProperty("--reveal-delay", `${Math.min(delay, 180)}ms`)
})

if (!reducedMotion.matches && revealItems.length > 0) {
  document.documentElement.dataset.revealMotion = "ready"

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const element = entry.target as HTMLElement
          element.dataset.revealState = "visible"
          observer.unobserve(element)
        })
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      },
    )

    revealItems.forEach(item => observer.observe(item))
  } else {
    revealItems.forEach(item => {
      item.dataset.revealState = "visible"
    })
  }
}
