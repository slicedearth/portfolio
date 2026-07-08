<script lang="ts">
  let isActive = $state(false)

  const links = [
    { href: "/#projects", label: "Projects" },
    { href: "/#about", label: "About Me" },
  ]
</script>

<nav
  class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-md"
  aria-label="main navigation"
>
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <a
      href="/"
      class="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-secondary text-2xl font-bold text-transparent"
    >
      Abymar
    </a>

    <button
      onclick={() => (isActive = !isActive)}
      type="button"
      class="flex flex-col items-center justify-center gap-1.5 sm:hidden"
      aria-label="menu"
      aria-expanded={isActive}
    >
      <span
        class="block h-0.5 w-6 bg-gray-300 transition-transform {isActive
          ? 'translate-y-2 rotate-45'
          : ''}"
      ></span>
      <span
        class="block h-0.5 w-6 bg-gray-300 transition-opacity {isActive ? 'opacity-0' : ''}"
      ></span>
      <span
        class="block h-0.5 w-6 bg-gray-300 transition-transform {isActive
          ? '-translate-y-2 -rotate-45'
          : ''}"
      ></span>
    </button>

    <div class="hidden items-center gap-8 sm:flex">
      {#each links as link}
        <a href={link.href} class="group relative font-bold text-gray-300 transition-colors hover:text-white">
          {link.label}
          <span class="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </a>
      {/each}
    </div>
  </div>

  <div
    class="overflow-hidden transition-[max-height,opacity] duration-300 sm:hidden {isActive
      ? 'max-h-40 opacity-100'
      : 'max-h-0 opacity-0'}"
  >
    <div class="flex flex-col items-center gap-4 pb-4">
      {#each links as link}
        <a
          href={link.href}
          onclick={() => (isActive = false)}
          class="group relative font-bold text-gray-300 transition-colors hover:text-white"
        >
          {link.label}
          <span class="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </a>
      {/each}
    </div>
  </div>
</nav>
