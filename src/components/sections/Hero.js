import React, { useCallback } from "react"
import Particles from "react-particles"
import tsparticlesConfig from "./tsparticles-config.json"
import { loadFull } from "tsparticles"
import ghIcon from "../../icons/github-original.svg"
export default function Hero() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine)
  }, [])
  return (
    <section className="relative z-0 bg-gradient-to-br from-gradient-1 via-gradient-2 to-gradient-3 py-24">
      <Particles
        id="tsparticles"
        className="absolute inset-0 -z-10"
        options={tsparticlesConfig}
        init={particlesInit}
      />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="animate__animated animate__bounceInDown animate__slow font-secondary text-6xl font-bold text-white [text-shadow:2px_2px_#333]">
          Hey, I'm Aser
        </h1>
        <h2 className="animate__animated animate__bounceIn animate__delay-2s mt-4 font-primary text-3xl text-white">
          Project Manager/Web Developer
        </h2>
        <div className="animate__animated animate__fadeInUp animate__delay-2s mt-8">
          <a
            className="inline-flex items-center gap-3 rounded-md bg-black/80 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-black"
            href="https://www.github.com/slicedearth"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img className="h-5 w-5" src={ghIcon} alt="GitHub Icon" />
            <span>GitHub Profile</span>
          </a>
        </div>
      </div>
    </section>
  )
}
