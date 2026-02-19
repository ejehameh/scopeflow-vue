export const ALEX = { name: "Alex", role: "Logistics Co", avatarLetter: "A" };
export const SARAH = { name: "Sarah Miller", role: "Team", avatarLetter: "S" };

export const SEED_COMMENTS = [
  {
    id: "seed-1",
    author: ALEX,
    body: "Can we add real-time tracking to Phase 2? Our warehouse needs to see where products are at all times.",
    timeAgo: "About 27 minutes ago",
    highlight: {
      pageNumber: 2,
      text: "Phase 2: Inventory Management",
      pinX: 85,
      pinY: 42,
      rects: [],
    },
    reactions: [],
    resolved: false,
    source: "annotation",
    replies: [
      {
        id: "seed-1-r1",
        author: SARAH,
        body: "Yes, we can include that. We've updated the scope in Phase 2. It will shift the timeline for that phase by 3 days.",
        timeAgo: "About 17 minutes ago",
        reactions: [],
        resolved: false,
        source: "annotation",
        replies: [],
      },
    ],
  },
];

export const DOCUMENT_OUTLINE = [
  { id: "introduction", label: "Introduction" },
  { id: "phase-1", label: "Phase 1: Discovery" },
  { id: "phase-2", label: "Phase 2: Development" },
  { id: "phase-3", label: "Phase 3: Deployment" },
];
