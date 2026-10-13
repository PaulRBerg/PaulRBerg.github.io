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
    description: "Paul Berg @ RatFest 2025",
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
    description: "Paul Berg @ ETHCluj 2025",
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
    description: "Paul Berg @ RatFest 2024",
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
    description: "Paul Berg @ Solidity Summit 2023",
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
    description: "Paul Berg @ Spearbit 2023",
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
    description: "Paul Berg @ EthCC 2023",
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
    description: "Paul Berg @ ETH École, July 21, 2021",
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
