document.querySelectorAll("[data-mobile-nav-link]").forEach(link => {
  link.addEventListener("click", () => {
    link.closest("details")?.removeAttribute("open")
  })
})

document.querySelectorAll("[data-mobile-nav]").forEach(menu => {
  menu.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !menu.open) return

    event.preventDefault()
    menu.open = false
    menu.querySelector("summary")?.focus()
  })
})
