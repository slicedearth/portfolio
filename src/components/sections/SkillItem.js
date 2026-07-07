import React from "react"
export default function Skilltem({ title, icon, icon_alt }) {
  return (
    <div className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-surface py-2 pr-4 pl-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-hover">
      {icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 p-1.5">
          <img className="h-full w-full" src={icon.publicURL} alt={icon_alt} />
        </div>
      )}
      <p className="text-sm font-medium whitespace-nowrap text-gray-200">
        {title}
      </p>
    </div>
  )
}
