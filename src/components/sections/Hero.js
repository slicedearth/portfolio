import React from "react"
import { Particles, ParticlesProvider } from "@tsparticles/react"
import { loadBasic } from "@tsparticles/basic"
import { loadImageShape } from "@tsparticles/shape-image"
import { loadRotateUpdater } from "@tsparticles/updater-rotate"
import { loadInteractivityPlugin } from "@tsparticles/plugin-interactivity"
import { loadParticlesCollisionsInteraction } from "@tsparticles/interaction-particles-collisions"
import tsparticlesConfig from "./tsparticles-config.json"
import ghIcon from "../../icons/github-original.svg"

const initParticles = async engine => {
  await Promise.all([
    loadBasic(engine),
    loadImageShape(engine),
    loadRotateUpdater(engine),
    loadInteractivityPlugin(engine),
  ])
  await loadParticlesCollisionsInteraction(engine)
}

export default function Hero() {
  return (
    <section className="relative z-0 overflow-hidden bg-bg py-32">
      <div className="absolute top-1/3 left-1/2 -z-20 h-96 w-96 -translate-x-2/3 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -z-20 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-accent-2/20 blur-3xl"></div>
      <ParticlesProvider init={initParticles}>
        <Particles
          id="tsparticles"
          className="animate-fade-in absolute inset-0 -z-10"
          options={tsparticlesConfig}
        />
      </ParticlesProvider>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="animate-fade-in-up text-sm font-semibold tracking-widest text-accent uppercase">
          Welcome
        </p>
        <h1 className="animate-fade-in-up mt-2 font-secondary text-6xl font-bold text-white drop-shadow-[0_2px_20px_rgba(34,211,238,0.25)]">
          Hey, I'm Aser
        </h1>
        <h2 className="animate-fade-in-up mt-4 font-primary text-3xl text-gray-200 [animation-delay:150ms]">
          Project Manager/Web Developer
        </h2>
        <div className="animate-fade-in-up mt-10 [animation-delay:300ms]">
          <a
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-800 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-slate-700 hover:shadow-xl hover:shadow-accent/10"
            href="https://www.github.com/slicedearth"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img className="h-5 w-5" src={ghIcon} alt="GitHub Icon" />
            <span>GitHub Profile</span>
          </a>
        </div>
      </div>
      <svg
        className="animate-bounce-slow absolute bottom-6 left-1/2 h-6 w-6 -translate-x-1/2 text-gray-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </section>
  )
}
