// Contenu éditorial — repris du site BIOMYR existant + brief cinématique.

export const HERO = {
  title: "BIOMYR",
  tagline: "Innover. Développer. Collaborer.",
  subtitle:
    "Des solutions biotechnologiques pour une agriculture plus durable, plus résiliente et plus performante.",
  ctaPrimary: "Découvrir",
  ctaSecondary: "Explorer nos axes",
};

export type Axis = {
  index: string;
  kicker: string;
  title: string;
  brand: string;
  text: string;
  still: string;
};

export const AXES: Axis[] = [
  {
    index: "01",
    kicker: "Produit physique",
    title: "VÉYÈR",
    brand: "La biosolution",
    text: "Substance de base à base de chitosane, issue de biopolymères. Le produit au cœur de l’offre BIOMYR, pour des cultures plus saines et des rendements plus élevés.",
    still: "/stills/still-03.jpg",
  },
  {
    index: "02",
    kicker: "Produit digital",
    title: "Agronomie digitale",
    brand: "La donnée au champ",
    text: "Diagnostic parcellaire, collecte de données, préconisation et suivi. Une agronomie pilotée par la donnée, précise et mesurable.",
    still: "/stills/still-04.jpg",
  },
  {
    index: "03",
    kicker: "Accompagnement",
    title: "Ingénierie & études",
    brand: "Le savoir-faire",
    text: "Itinéraires techniques, études techniques & financières, recherche et développement. Un accompagnement de bout en bout, du projet à la parcelle.",
    still: "/stills/still-05.jpg",
  },
  {
    index: "04",
    kicker: "Transfert de connaissance",
    title: "BIOMYR Académie",
    brand: "La transmission",
    text: "Formations et transfert de compétences pour les professionnels agricoles. Partager le savoir pour faire grandir toute la filière.",
    still: "/stills/still-06.jpg",
  },
];

export const ABOUT = {
  kicker: "Qui sommes-nous",
  title: "Enracinés dans le vivant",
  text: "BIOMYR développe, à partir de biopolymères, des biosolutions pour une agriculture durable et performante. Comme un arbre, notre force vient des racines : la science, le terrain et la collaboration nourrissent chacune de nos quatre branches.",
};

export const FINAL = {
  kicker: "Cultivons l’avenir",
  title: "Un projet de culture ?",
  text: "Parlons de vos parcelles, de vos objectifs de rendement et de durabilité.",
  ctaPrimary: "Demander un devis",
  ctaSecondary: "Découvrir VÉYÈR",
};

export const CONTACT = {
  address: "7J Chemin Mont Rose, 97441 Sainte-Suzanne, La Réunion",
  phone: "0692 57 52 25",
  email: "contact@biomyr.com",
};

export const NAV = ["Notre approche", "Nos solutions", "Ressources", "Qui sommes-nous"];

export const FRAME_COUNT = 144;
