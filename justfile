set allow-duplicate-variables
set allow-duplicate-recipes
set shell := ["bash", "-euo", "pipefail", "-c"]
set unstable

# ---------------------------------------------------------------------------- #
#                                   COMMANDS                                   #
# ---------------------------------------------------------------------------- #

# Show available commands
default:
    @just --list

# Start Astro dev server
@dev:
    bun run dev
alias d := dev

# Build for production
@build:
    bun run build
alias b := build

# Preview production build
@preview:
    bun run preview
alias p := preview

# ---------------------------------------------------------------------------- #
#                                    CHECKS                                    #
# ---------------------------------------------------------------------------- #

# Run all code checks
[group("checks")]
@full-check:
    just rws astro-check
    just rws oxfmt-check
    just rws prettier-check
    just rws oxlint-check
    echo ""
    echo -e '{{ GREEN }}All code checks passed!{{ NORMAL }}'
alias fc := full-check

# Run all code fixes
[group("checks")]
@full-write:
    just rws oxfmt-write
    just rws prettier-write
    just rws oxlint-write
    echo ""
    echo -e '{{ GREEN }}All code fixes applied!{{ NORMAL }}'
alias fw := full-write

# Lint with oxlint
[group("checks")]
@oxlint-check:
    bun run oxlint
alias oc := oxlint-check

# Run Astro type and content checks
[group("checks")]
@astro-check:
    bun run astro check
alias ac := astro-check

# Lint with oxlint
[group("checks")]
@oxlint-write:
    bun run oxlint --fix
alias ow := oxlint-write

# Check formatting with oxfmt
[group("checks")]
@oxfmt-check:
    bun run oxfmt --check
alias ofc := oxfmt-check

# Format with oxfmt
[group("checks")]
@oxfmt-write:
    bun run oxfmt --write
alias ofw := oxfmt-write

# Check Astro and Markdown formatting with Prettier
[group("checks")]
@prettier-check:
    bun run prettier --check "**/*.{astro,md,mdx}"
alias pc := prettier-check

# Format Astro and Markdown files with Prettier
[group("checks")]
@prettier-write:
    bun run prettier --write "**/*.{astro,md,mdx}"
alias pw := prettier-write

# ---------------------------------------------------------------------------- #
#                                    DEPLOY                                    #
# ---------------------------------------------------------------------------- #

# Deploy preview to Vercel
[group("deploy")]
@deploy-preview:
    bun run vercel
alias dp := deploy-preview

# Deploy to production on Vercel
[group("deploy")]
@deploy-prod:
    bun run vercel --prod
alias dpr := deploy-prod

# ---------------------------------------------------------------------------- #
#                                   UTILITIES                                  #
# ---------------------------------------------------------------------------- #

# Private recipe to run a check with formatted output
@_run-with-status recipe:
    echo ""
    echo -e '{{ CYAN }}→ Running {{ recipe }}...{{ NORMAL }}'
    just {{ recipe }}
    echo -e '{{ GREEN }}✓ {{ recipe }} completed{{ NORMAL }}'
alias rws := _run-with-status
