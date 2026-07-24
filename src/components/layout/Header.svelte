<script lang="ts">
  let isActive = $state(false)

  const links = [
    { href: "/#projects", number: "01", label: "Projects" },
    { href: "/#about", number: "02", label: "About" },
  ]
</script>

<nav
  class="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/90 backdrop-blur-xl"
  aria-label="main navigation"
>
  <div
    class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
  >
    <a
      href="/"
      class="font-secondary text-3xl font-bold text-accent transition-colors hover:text-white"
    >
      Abymar
    </a>

    <button
      onclick={() => (isActive = !isActive)}
      type="button"
      class="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-line bg-surface sm:hidden"
      aria-label="Toggle navigation"
      aria-expanded={isActive}
    >
      <span
        class="block h-0.5 w-5 bg-gray-200 transition-transform motion-reduce:transition-none {isActive
          ? 'translate-y-2 rotate-45'
          : ''}"
      ></span>
      <span
        class="block h-0.5 w-5 bg-gray-200 transition-opacity motion-reduce:transition-none {isActive
          ? 'opacity-0'
          : ''}"
      ></span>
      <span
        class="block h-0.5 w-5 bg-gray-200 transition-transform motion-reduce:transition-none {isActive
          ? '-translate-y-2 -rotate-45'
          : ''}"
      ></span>
    </button>

    <div class="hidden items-center gap-7 sm:flex">
      {#each links as link}
        <a
          href={link.href}
          class="group flex items-baseline gap-2 font-code text-sm text-gray-300 transition-colors hover:text-white"
        >
          <span class="text-accent">{link.number}</span>
          <span>{link.label}</span>
        </a>
      {/each}
    </div>
  </div>

  <div
    class="overflow-hidden border-line bg-surface transition-[max-height,opacity,border-width] duration-300 motion-reduce:transition-none sm:hidden {isActive
      ? 'max-h-40 opacity-100'
      : 'max-h-0 border-t-0 opacity-0'}"
  >
    <div class="flex flex-col px-5 py-4">
      {#each links as link}
        <a
          href={link.href}
          onclick={() => (isActive = false)}
          class="flex items-center gap-3 border-b border-line/70 py-3 font-code text-gray-200 last:border-b-0"
        >
          <span class="text-accent">{link.number}</span>
          <span>{link.label}</span>
        </a>
      {/each}
    </div>
  </div>
</nav>
