import React from "react"
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface px-4 py-10 text-center text-gray-400">
      <p>&copy; slicedearth 2024</p>
      <p className="mt-1">
        Built with{" "}
        <a
          href="https://gatsbyjs.com/"
          rel="noopener noreferrer"
          target="_blank"
          className="font-semibold text-accent transition-colors hover:text-accent-dark hover:underline"
        >
          Gatsby
        </a>{" "}
        &{" "}
        <a
          href="https://tailwindcss.com"
          rel="noopener noreferrer"
          target="_blank"
          className="font-semibold text-accent transition-colors hover:text-accent-dark hover:underline"
        >
          Tailwind CSS
        </a>
      </p>
    </footer>
  )
}
