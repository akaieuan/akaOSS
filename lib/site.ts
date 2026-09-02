/**
 * The studio's identity and the sentence it exists to make. Everything else
 * that used to live here (layer copy, evidence strips, an interlock diagram)
 * belonged to a homepage that no longer exists and was deleted with it.
 */

export const BRAND = {
  name: "akaOSS",
  tagline: "Human-in-the-loop AI, measured properly.",
  description:
    "A design system and component library for human-in-the-loop AI, grounded in an open perspective paper.",
  github: "https://github.com/akaieuan/HITL-KIT",
  twitter: "https://x.com/akaieuan",
  site: "https://www.akaoss.dev",
  author: "Ieuan King",
  authorHandle: "akaieuan",
};

export const THESIS = {
  lede:
    "Most AI systems are evaluated on whether they can complete tasks autonomously. But in deployment, they need to assist humans, not replace them. That mismatch is why 95% of enterprise AI pilots fail.",
  claim:
    "Assist-Not-Complete is a paradigm for building AI systems that collaborate with humans instead of displacing them.",
};

export const PARADIGM = {
  def: "Evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone.",
  umbrella:
    "HITL Kit is the argument that we should measure AI differently, and the components that make the alternative buildable.",
};
