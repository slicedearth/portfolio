import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Header() {
  const [isActive, setisActive] = useState(false)

  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )
  return (
    <div>
      <nav
        className="navbar is-grad is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a
            className="navbar-item is-family-secondary has-text-weight-bold is-size-4"
            href="/"
          >
            {data.site.siteMetadata.title}
          </a>

          <div
            onClick={() => {
              setisActive(!isActive)
            }}
            role="button"
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            data-target="navMenu"
            aria-label="menu"
            aria-expanded="false"
            aria-hidden="true"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>

        <div
          id="navMenu"
          className={`navbar-menu ${isActive ? "is-active is-grad" : ""}`}
        >
          <div className="navbar-end">
            <a
              href="#projects"
              className="navbar-item has-text-centered-touch has-text-weight-bold"
            >
              Projects
            </a>
            <a
              href="#about"
              className="navbar-item has-text-centered-touch has-text-weight-bold"
            >
              About Me
            </a>
            <a
              href="#contact"
              className="navbar-item has-text-centered-touch has-text-weight-bold"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}

// import React, { useState } from "react"
// import { useStaticQuery, graphql } from "gatsby"
// import AnchorLink from "react-anchor-link-smooth-scroll"
// export default function Header() {
//   const [isActive, setisActive] = useState(false)

//   const data = useStaticQuery(
//     graphql`
//       query {
//         site {
//           siteMetadata {
//             title
//           }
//         }
//       }
//     `
//   )
//   return (
//     <div>
//       <nav
//         className="navbar is-grad is-fixed-top"
//         role="navigation"
//         aria-label="main navigation"
//       >
//         <div className="navbar-brand">
//           <a
//             className="navbar-item is-family-secondary has-text-weight-bold is-size-4"
//             href="/"
//           >
//             {data.site.siteMetadata.title}
//           </a>

//           <div
//             onClick={() => {
//               setisActive(!isActive)
//             }}
//             role="button"
//             className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
//             data-target="navMenu"
//             aria-label="menu"
//             aria-expanded="false"
//             aria-hidden="true"
//           >
//             <span aria-hidden="true"></span>
//             <span aria-hidden="true"></span>
//             <span aria-hidden="true"></span>
//           </div>
//         </div>

//         <div
//           id="navMenu"
//           className={`navbar-menu ${isActive ? "is-active is-grad" : ""}`}
//         >
//           <div className="navbar-end">
//             <AnchorLink
//               href="#projects"
//               className="navbar-item has-text-centered-touch has-text-weight-bold"
//             >
//               Projects
//             </AnchorLink>
//             <AnchorLink
//               href="#about"
//               className="navbar-item has-text-centered-touch has-text-weight-bold"
//             >
//               About Me
//             </AnchorLink>
//             <AnchorLink
//               href="#contact"
//               className="navbar-item has-text-centered-touch has-text-weight-bold"
//             >
//               Contact
//             </AnchorLink>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }
