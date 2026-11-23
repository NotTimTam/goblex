export function capitalizeWords(s) {
  const lowercaseWords = [
    // Articles
    "a",
    "an",
    "the",

    // Coordinating conjunctions
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",

    // Short prepositions
    "as",
    "at",
    "by",
    "in",
    "of",
    "off",
    "on",
    "per",
    "to",
    "up",
    "via",
  ];

  return s
    .split(" ")
    .map((w) =>
      lowercaseWords.includes(w) ? w : w[0].toUpperCase() + w.slice(1),
    )
    .join(" ");
}
