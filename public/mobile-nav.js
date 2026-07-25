document.querySelectorAll("[data-mobile-nav-link]").forEach(link => {
  link.addEventListener("click", () => {
    link.closest("details")?.removeAttribute("open")
  })
})
