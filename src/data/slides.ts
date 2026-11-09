export interface RevealSlide {
  slug: string;
  title: string;
  description: string;
  theme: "serif" | "white";
  favicon: string;
  image: string;
  imageType: "image/jpeg" | "image/png";
  imageWidth: number;
  imageHeight: number;
}

export const revealSlides: RevealSlide[] = [
  {
    description:
      "RatFest 2025 slides on what IQ research gets right, where genetic explanations fall short, and how a Popperian view of knowledge reframes intelligence.",
    favicon: "/favicon.svg",
    image: "/presentations/ratfest-2025/img/david-paul-chat-bubbles.jpg",
    imageHeight: 1024,
    imageType: "image/jpeg",
    imageWidth: 1536,
    slug: "ratfest-2025",
    theme: "white",
    title: "IQ: The Good, the Bad, and the Popperian"
  },
  {
    description:
      "ETHCluj 2025 slides arguing that DeFi TVL is a vanity metric until a protocol survives real attacks, with lessons from building Sablier.",
    favicon: "/presentations/ethcluj-2025/img/favicon.ico",
    image: "/presentations/ethcluj-2025/og.jpg",
    imageHeight: 657,
    imageType: "image/jpeg",
    imageWidth: 1200,
    slug: "ethcluj-2025",
    theme: "white",
    title: "Schrodinger's TVL: Until You Hack It, It's Not Real"
  },
  {
    description:
      "RatFest 2024 slides applying David Deutsch's principle of optimism to Persistent Predatory Personality and the moral philosophy of dark-triad traits.",
    favicon: "/favicon.svg",
    image: "/presentations/ratfest-2024/img/icy-brain.png",
    imageHeight: 1024,
    imageType: "image/png",
    imageWidth: 1024,
    slug: "ratfest-2024",
    theme: "white",
    title: "The Moral Philosophy of Icy Brains"
  },
  {
    description:
      "Solidity Summit 2023 slides introducing the Branching Tree Technique (BTT) for writing structured, specification-driven Foundry test suites.",
    favicon: "/presentations/solidity-summit-2023/img/favicon.ico",
    image: "/presentations/solidity-summit-2023/og.jpg",
    imageHeight: 1660,
    imageType: "image/jpeg",
    imageWidth: 2402,
    slug: "solidity-summit-2023",
    theme: "white",
    title: "Branching Tree Technique"
  },
  {
    description:
      "Spearbit seminar slides from September 2023 on the Branching Tree Technique (BTT), with a deep dive into how Sablier V2 structures its Foundry tests.",
    favicon: "/presentations/spearbit-2023/img/favicon.ico",
    image: "/presentations/spearbit-2023/og.jpg",
    imageHeight: 1808,
    imageType: "image/jpeg",
    imageWidth: 2612,
    slug: "spearbit-2023",
    theme: "white",
    title: "Branching Tree Technique"
  },
  {
    description:
      "EthCC 2023 slides on testing best practices in Foundry, from organizing test files and contracts to the Branching Tree Technique.",
    favicon: "/presentations/ethcc-2023/img/favicon.ico",
    image: "/presentations/ethcc-2023/og.jpg",
    imageHeight: 818,
    imageType: "image/jpeg",
    imageWidth: 1124,
    slug: "ethcc-2023",
    theme: "serif",
    title: "Testing Best Practices in Foundry"
  },
  {
    description:
      "ETH École 2021 slides introducing PRBMath, a gas-efficient Solidity library for fixed-point math with logarithms, exponentials, and square roots.",
    favicon: "/favicon.svg",
    image: "/presentations/eth-ecole-2021/img/prbmath-cover.png",
    imageHeight: 675,
    imageType: "image/png",
    imageWidth: 1200,
    slug: "eth-ecole-2021",
    theme: "white",
    title: "PRBMath"
  }
];
