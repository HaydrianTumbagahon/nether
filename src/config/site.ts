export const site = {
  name: "Nether",
  tagline:
    "I cover modern web development, AI in web work, and PC gear worth knowing.",
  url: "https://example.com",
  author: "HADES",
  socialLinks: [],
  gearTypes: [
    {
      slug: "keyboards",
      label: "Keyboards",
      gearType: "keyboards",
      description:
        "Layouts, switches, and the details that shape a keyboard on my desk.",
      introduction:
        "This section covers keyboard layouts, switch types, keycaps, and the terms used to describe a board. Guides explain the options, while comparisons help make the trade-offs easier to follow without treating one specification as the whole answer.",
    },
    {
      slug: "mice",
      label: "Mice",
      gearType: "mice",
      description:
        "Mice and pointing devices, from their shape to the work they support.",
      introduction:
        "Find notes on mouse shapes, sensor features, controls, and connectivity. The aim is to explain what each choice changes and which details are worth checking for a particular setup.",
    },
    {
      slug: "headphones",
      label: "Headphones",
      gearType: "headphones",
      description:
        "Headphones and headsets, with notes on sound, fit, and everyday use.",
      introduction:
        "This section includes headphones, headsets, and in-ear monitors. Guides cover common terms such as fit, connection, and controls so product descriptions are easier to compare in context.",
    },
    {
      slug: "other",
      label: "Other Gear",
      gearType: "other",
      description:
        "Desk mats, webcams, microphones, controllers, hubs, and anything else that earns its place.",
      introduction:
        "Browse other desk and PC equipment, including webcams, microphones, controllers, hubs, and accessories. The category gives less common gear a place without forcing it into a keyboard, mouse, or audio label.",
    },
  ],
  categories: [
    {
      slug: "web-development",
      label: "Web Development",
      description: "Notes on current web technologies, tools, and techniques.",
      introduction:
        "These articles cover browser behavior, web standards, CSS, JavaScript, AI tools, and the tools used to build sites. Each guide starts from a practical question and explains the relevant concepts and trade-offs in plain language.",
    },
    {
      slug: "peripherals",
      label: "PC Peripherals",
      description:
        "A closer look at mechanical keyboards, mice, headphones, and other PC gear.",
      introduction:
        "Browse articles about keyboards, mice, audio gear, and other PC peripherals. The writing explains product terminology and practical differences so readers can compare options against their own needs.",
    },
  ],
} as const;
