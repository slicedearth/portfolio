import React from "react"
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gradient-1 via-gradient-2 to-gradient-3 px-4 py-8 text-center text-white">
      <p>&copy; slicedearth 2024</p>
      <p>
        Built with{" "}
        <a
          href="https://gatsbyjs.com/"
          rel="noopener noreferrer"
          target="_blank"
          className="font-semibold hover:underline"
        >
          Gatsby
        </a>{" "}
        &{" "}
        <a
          href="https://tailwindcss.com"
          rel="noopener noreferrer"
          target="_blank"
          className="font-semibold hover:underline"
        >
          Tailwind CSS
        </a>
      </p>
    </footer>
  )
}
