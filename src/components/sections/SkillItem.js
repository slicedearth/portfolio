import React from "react"
export default function Skilltem({ title, icon, icon_alt }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-white p-5 text-center shadow-[0_0.5em_1em_-0.125em_rgba(10,10,10,0.1),0_0_0_1px_rgba(10,10,10,0.02)]">
      {icon && (
        <img className="h-16 w-16" src={icon.publicURL} alt={icon_alt} />
      )}
      <p className="pt-3 text-base font-medium">{title}</p>
    </div>
  )
}
