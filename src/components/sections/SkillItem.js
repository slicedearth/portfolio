import React from "react"
export default function Skilltem({ title, icon, icon_alt }) {
  return (
    <div className="skill-item">
      {icon && (
        <img className="skill-icon" src={icon.publicURL} alt={icon_alt} />
      )}
      <p className="has-text-centered skill-text title is-size-6">{title}</p>
    </div>
  )
}
