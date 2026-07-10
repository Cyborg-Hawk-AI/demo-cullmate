export type WeddingStatus =
  | "queued"
  | "ingesting"
  | "grouping"
  | "scoring"
  | "exporting"
  | "complete"
  | "review";

export type Wedding = {
  id: string;
  couple: string;
  venue: string;
  date: string;
  photographer: string;
  studio: string;
  rawCount: number;
  selectedCount: number;
  duplicateGroups: number;
  status: WeddingStatus;
  progress: number;
  sharpnessAvg: number;
  eyesOpenRate: number;
  expressionScore: number;
  catalogSync: "lightroom" | "capture-one" | "both" | "none";
  galleryExported: boolean;
};

export type DuplicateGroup = {
  id: string;
  weddingId: string;
  scene: string;
  count: number;
  bestShotId: string;
  shots: {
    id: string;
    filename: string;
    sharpness: number;
    eyesOpen: boolean;
    expression: number;
    selected: boolean;
  }[];
};

export type ActivityItem = {
  id: string;
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "processing";
  weddingId?: string;
};

export type GalleryPhoto = {
  id: string;
  filename: string;
  category: string;
  score: number;
  exported: boolean;
};

export const WEDDINGS: Wedding[] = [
  {
    id: "w-001",
    couple: "Emma & James Chen",
    venue: "The Barn at Willow Creek, Napa Valley",
    date: "2026-06-14",
    photographer: "Sarah Mitchell",
    studio: "Mitchell Wedding Co.",
    rawCount: 3847,
    selectedCount: 412,
    duplicateGroups: 287,
    status: "complete",
    progress: 100,
    sharpnessAvg: 91.2,
    eyesOpenRate: 94.8,
    expressionScore: 88.5,
    catalogSync: "lightroom",
    galleryExported: true,
  },
  {
    id: "w-002",
    couple: "Olivia & Marcus Rivera",
    venue: "Oceanview Estate, Malibu",
    date: "2026-06-21",
    photographer: "Sarah Mitchell",
    studio: "Mitchell Wedding Co.",
    rawCount: 2913,
    selectedCount: 0,
    duplicateGroups: 0,
    status: "scoring",
    progress: 67,
    sharpnessAvg: 0,
    eyesOpenRate: 0,
    expressionScore: 0,
    catalogSync: "both",
    galleryExported: false,
  },
  {
    id: "w-003",
    couple: "Priya & David Okonkwo",
    venue: "Brooklyn Botanic Garden, NYC",
    date: "2026-06-28",
    photographer: "Alex Torres",
    studio: "Torres & Lens Studio",
    rawCount: 4218,
    selectedCount: 0,
    duplicateGroups: 312,
    status: "grouping",
    progress: 42,
    sharpnessAvg: 0,
    eyesOpenRate: 0,
    expressionScore: 0,
    catalogSync: "capture-one",
    galleryExported: false,
  },
  {
    id: "w-004",
    couple: "Hannah & Liam O'Brien",
    venue: "Ashford Castle, County Mayo",
    date: "2026-07-05",
    photographer: "Alex Torres",
    studio: "Torres & Lens Studio",
    rawCount: 3562,
    selectedCount: 0,
    duplicateGroups: 0,
    status: "queued",
    progress: 0,
    sharpnessAvg: 0,
    eyesOpenRate: 0,
    expressionScore: 0,
    catalogSync: "none",
    galleryExported: false,
  },
  {
    id: "w-005",
    couple: "Sofia & Noah Kim",
    venue: "Four Seasons Resort, Maui",
    date: "2026-05-30",
    photographer: "Sarah Mitchell",
    studio: "Mitchell Wedding Co.",
    rawCount: 5124,
    selectedCount: 534,
    duplicateGroups: 398,
    status: "review",
    progress: 100,
    sharpnessAvg: 89.7,
    eyesOpenRate: 92.1,
    expressionScore: 86.3,
    catalogSync: "lightroom",
    galleryExported: false,
  },
];

export const DUPLICATE_GROUPS: DuplicateGroup[] = [
  {
    id: "dg-001",
    weddingId: "w-001",
    scene: "First Look — Garden Terrace",
    count: 14,
    bestShotId: "s-001-3",
    shots: [
      { id: "s-001-1", filename: "DSC_4821.NEF", sharpness: 72, eyesOpen: true, expression: 78, selected: false },
      { id: "s-001-2", filename: "DSC_4822.NEF", sharpness: 85, eyesOpen: false, expression: 82, selected: false },
      { id: "s-001-3", filename: "DSC_4823.NEF", sharpness: 96, eyesOpen: true, expression: 94, selected: true },
      { id: "s-001-4", filename: "DSC_4824.NEF", sharpness: 88, eyesOpen: true, expression: 71, selected: false },
    ],
  },
  {
    id: "dg-002",
    weddingId: "w-001",
    scene: "Ceremony — Aisle Walk",
    count: 22,
    bestShotId: "s-002-2",
    shots: [
      { id: "s-002-1", filename: "DSC_5102.NEF", sharpness: 68, eyesOpen: true, expression: 65, selected: false },
      { id: "s-002-2", filename: "DSC_5103.NEF", sharpness: 94, eyesOpen: true, expression: 91, selected: true },
      { id: "s-002-3", filename: "DSC_5104.NEF", sharpness: 79, eyesOpen: false, expression: 88, selected: false },
    ],
  },
  {
    id: "dg-003",
    weddingId: "w-001",
    scene: "Reception — First Dance",
    count: 18,
    bestShotId: "s-003-1",
    shots: [
      { id: "s-003-1", filename: "DSC_6201.NEF", sharpness: 91, eyesOpen: true, expression: 96, selected: true },
      { id: "s-003-2", filename: "DSC_6202.NEF", sharpness: 83, eyesOpen: true, expression: 72, selected: false },
      { id: "s-003-3", filename: "DSC_6203.NEF", sharpness: 77, eyesOpen: false, expression: 85, selected: false },
    ],
  },
  {
    id: "dg-004",
    weddingId: "w-003",
    scene: "Portraits — Rose Garden",
    count: 11,
    bestShotId: "s-004-2",
    shots: [
      { id: "s-004-1", filename: "IMG_2201.CR3", sharpness: 74, eyesOpen: true, expression: 80, selected: false },
      { id: "s-004-2", filename: "IMG_2202.CR3", sharpness: 92, eyesOpen: true, expression: 89, selected: true },
      { id: "s-004-3", filename: "IMG_2203.CR3", sharpness: 81, eyesOpen: false, expression: 76, selected: false },
    ],
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: "a-1", time: "2 min ago", message: "AI scoring completed for 1,952 frames in Olivia & Marcus Rivera wedding", type: "success", weddingId: "w-002" },
  { id: "a-2", time: "8 min ago", message: "Duplicate grouping found 312 burst sequences in Priya & David Okonkwo", type: "processing", weddingId: "w-003" },
  { id: "a-3", time: "14 min ago", message: "Lightroom catalog sync: 412 picks written to 'Emma Chen Wedding.lrcat'", type: "success", weddingId: "w-001" },
  { id: "a-4", time: "22 min ago", message: "Gallery export ready — 412 images, 3.2 GB ZIP for Emma & James Chen", type: "success", weddingId: "w-001" },
  { id: "a-5", time: "35 min ago", message: "RAW ingestion: 2,913 NEF files uploaded from Olivia & Marcus Rivera", type: "info", weddingId: "w-002" },
  { id: "a-6", time: "1 hr ago", message: "Sofia & Noah Kim flagged for manual review — 23 ambiguous expression scores", type: "warning", weddingId: "w-005" },
  { id: "a-7", time: "2 hr ago", message: "GPU queue: 2 weddings processing, estimated 18 min remaining", type: "processing" },
  { id: "a-8", time: "3 hr ago", message: "Capture One session linked for Priya & David Okonkwo", type: "info", weddingId: "w-003" },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "g-1", filename: "DSC_4823.jpg", category: "First Look", score: 96, exported: true },
  { id: "g-2", filename: "DSC_5103.jpg", category: "Ceremony", score: 94, exported: true },
  { id: "g-3", filename: "DSC_6201.jpg", category: "Reception", score: 96, exported: true },
  { id: "g-4", filename: "DSC_5401.jpg", category: "Portraits", score: 92, exported: true },
  { id: "g-5", filename: "DSC_5502.jpg", category: "Portraits", score: 90, exported: true },
  { id: "g-6", filename: "DSC_5801.jpg", category: "Details", score: 88, exported: true },
  { id: "g-7", filename: "DSC_5903.jpg", category: "Family", score: 87, exported: true },
  { id: "g-8", filename: "DSC_6102.jpg", category: "Reception", score: 91, exported: false },
  { id: "g-9", filename: "DSC_6304.jpg", category: "Dancing", score: 85, exported: false },
  { id: "g-10", filename: "DSC_6401.jpg", category: "Send-off", score: 93, exported: false },
];

export const MONTHLY_STATS = {
  weddingsProcessed: 23,
  totalRaws: 78432,
  hoursSaved: 142,
  avgCullTime: "22 min",
  gpuUtilization: 78,
  subscriptionRevenue: 1176,
};

export const PROCESSING_CHART = [
  { month: "Jan", weddings: 14, hoursSaved: 84 },
  { month: "Feb", weddings: 16, hoursSaved: 96 },
  { month: "Mar", weddings: 18, hoursSaved: 108 },
  { month: "Apr", weddings: 21, hoursSaved: 126 },
  { month: "May", weddings: 19, hoursSaved: 114 },
  { month: "Jun", weddings: 23, hoursSaved: 142 },
];

export const SCORE_DISTRIBUTION = [
  { label: "90-100", count: 142 },
  { label: "80-89", count: 198 },
  { label: "70-79", count: 52 },
  { label: "60-69", count: 20 },
];

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusLabel(status: WeddingStatus): string {
  const labels: Record<WeddingStatus, string> = {
    queued: "Queued",
    ingesting: "Ingesting RAWs",
    grouping: "Grouping Duplicates",
    scoring: "AI Scoring",
    exporting: "Exporting Gallery",
    complete: "Complete",
    review: "Needs Review",
  };
  return labels[status];
}

export function statusColor(status: WeddingStatus): string {
  const colors: Record<WeddingStatus, string> = {
    queued: "text-zinc-400 bg-zinc-400/10",
    ingesting: "text-blue-400 bg-blue-400/10",
    grouping: "text-purple-400 bg-purple-400/10",
    scoring: "text-amber-400 bg-amber-400/10",
    exporting: "text-cyan-400 bg-cyan-400/10",
    complete: "text-emerald-400 bg-emerald-400/10",
    review: "text-orange-400 bg-orange-400/10",
  };
  return colors[status];
}
