// Internal pass verification config — used by scan API for instant offline validation

export interface VerifiedPassEntry {
  id: number;
  tid: string;
  n: string;
  p: number;
  t: "i" | "g";
  ph?: string;
}

// Pre-verified pass entries for instant gate approval
const _r: VerifiedPassEntry[] = [
  // ── PART 1: 10 Individual Passes with Assigned Contacts ───────────────────
  // #1: Assigned contact: +91 9925602705
  { id: 1, tid: "4da47c4a-791d-42d3-a269-cf5b0a7a81ce", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9925602705" },
  // #2 - #10: Assigned contact: +91 9033017174
  { id: 2, tid: "42b21d81-bbb7-4269-9ef8-184a293b983b", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 3, tid: "c536b544-4b36-433f-96b3-b937f20304ea", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 4, tid: "65168909-9dd3-43de-bea1-c5e29340d20c", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 5, tid: "633aba6d-ef03-485a-b3eb-2300ce33155c", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 6, tid: "73eb3763-f78a-401d-abfe-4d885efd6fec", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 7, tid: "3940a370-f2fb-41e9-aaae-0f11562d6972", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 8, tid: "5fc6785a-0988-42d3-81d2-8b2392ec5583", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 9, tid: "a6591cbd-d597-4440-91ba-6ed726fdd42b", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },
  { id: 10, tid: "aea5d4bf-8f5b-4b55-8165-ba2962e8bf27", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9033017174" },

  // ── PART 2: 4 Group Passes (Total Capacity: 50 Persons) ───────────────────
  { id: 11, tid: "64ae54f3-a036-4403-8d30-cea797d6100f", n: "Sanskrutik Guest", p: 20, t: "g" },
  { id: 12, tid: "b6abd8fe-5b3f-47b4-a98b-8a7cb7c67b7d", n: "Sanskrutik Guest", p: 10, t: "g" },
  { id: 13, tid: "fc6ee78c-52cc-4d16-aa24-fdc2e55d3523", n: "Sanskrutik Guest", p: 10, t: "g" },
  { id: 14, tid: "84fc9c0e-1e69-4aa4-8ca7-43c9fe6f918c", n: "Sanskrutik Guest", p: 10, t: "g" },

  // ── PART 3: 50 Individual Passes with Working Ticket IDs (#15 to #64) ─────
  { id: 15, tid: "9d901b0b-8d76-4b2a-a9e9-79815049b8ce", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 16, tid: "f145be96-b07a-4286-a193-4a370e59a72b", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 17, tid: "d8315ea0-520f-488f-a94f-5b128527a0fe", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 18, tid: "a61358ef-356c-4860-a292-1dc31f415c15", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 19, tid: "b73523ae-7a2e-4b4d-94bf-804153aeef46", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 20, tid: "2bcdafc7-32c0-4efd-b94f-01582e04ff04", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 21, tid: "c3ea6438-cfb2-4d70-a359-5f25fe732104", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 22, tid: "0a3901b4-ff77-4933-bf9c-6ec638d0119b", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 23, tid: "3388a107-75e1-45a4-9e8a-dfb965f80b91", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 24, tid: "16751229-3d14-419a-9e55-89689408b0fb", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 25, tid: "6fce3b44-0b1d-44a6-9ea6-f7f3e827b59e", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 26, tid: "b4d7fca1-1972-4632-a5ea-f24fa93f9cb9", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 27, tid: "03473f32-cfc3-4d4b-bbca-5bc407c91350", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 28, tid: "e44d32a0-40e9-44aa-9ff7-5ea0cb4ffbe9", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 29, tid: "2f42a59e-4e6f-47a3-8681-4b1388147d96", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 30, tid: "e75a9b70-96b6-4b95-a7b6-c56baefb8898", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 31, tid: "c79ff579-a1b7-4a6c-a813-fdf56ce50ff8", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 32, tid: "cefa14b4-a21d-43cb-b56e-81e0ae8e4da4", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 33, tid: "913f64c1-df07-428a-ba0f-c820b17168f1", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 34, tid: "8a4fc151-5aa6-4c9f-ba9c-3660a92eeb17", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 35, tid: "94c8b6bc-d976-466a-b519-c4ee4003d85d", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 36, tid: "d072b252-03d6-4e59-8692-a1622359ea43", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 37, tid: "a7516801-b8cf-482a-a589-9a64522ce22c", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 38, tid: "83b9cf78-dc29-4a92-95f7-f584e03038ea", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 39, tid: "eb13328d-1906-4447-aa6d-88b17ee96c14", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 40, tid: "389f4fbb-7da3-4903-b0fc-d1ef1492baee", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 41, tid: "896b014a-59df-4a69-8fc7-a2f0fb27c3a2", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 42, tid: "a85cf088-ff8f-4cfc-bfa8-0b540306bf2b", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 43, tid: "61405b56-c2ba-4bcf-a548-d3e913a48e7e", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 44, tid: "1cb7f8d6-6a12-4217-a068-07bc29938b81", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 45, tid: "2c70c02e-ff6a-4933-9118-a6d89531ecb8", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 46, tid: "c9c21ca9-555e-4f16-9e67-d8c764e52b2d", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 47, tid: "0a7ba6a9-839f-4eb8-a72a-605bb9bc7ae2", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 48, tid: "3f339f4d-cb7f-442a-96c2-4aa3c767be3d", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 49, tid: "50fa15fc-3e6f-47cb-b461-827b5c00e625", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 50, tid: "5b8f60ad-28d8-4f2a-89a3-5c742c07ef9d", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 51, tid: "57f59d57-19aa-4034-8c88-2921008d72df", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 52, tid: "207fe7c2-d48e-491b-8528-765089e90089", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 53, tid: "2c1995f9-bcff-44e2-b108-a53f06c4b6cf", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 54, tid: "333c1622-dc3d-4952-b883-faee71836262", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 55, tid: "e0374e5d-16a7-4786-9a25-9f5b66d62ea0", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 56, tid: "66ae4ba6-17b5-4bfe-a70e-1317765ec176", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 57, tid: "542a27ff-8fc3-4a17-b778-be7f7394625b", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 58, tid: "5762a4ae-f41e-450a-a1ad-46fc59a84d41", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 59, tid: "8a4fcbe8-1dca-4784-a1e1-e9ee4424319c", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 60, tid: "ce8a30fa-e49c-449e-b7cf-be277028e3b3", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 61, tid: "16e61f22-126c-482a-a38f-a713b194fb82", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 62, tid: "0cb5c71a-64da-44a7-8f55-1f6b89e6eb1f", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 63, tid: "8c9fc405-b778-4389-9800-47bf1450a257", n: "Sanskrutik Guest", p: 1, t: "i" },
  { id: 64, tid: "1bf42bc4-6721-4f15-84ea-3151cf57fa5e", n: "Sanskrutik Guest", p: 1, t: "i" },

  // ── PART 4: 3 Additional Passes with Contact +91 9825976164 (#65 to #67) ──
  { id: 65, tid: "1a311bec-4df8-4e6e-aafe-70e881fdce2b", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9825976164" },
  { id: 66, tid: "e955591b-fb48-4438-a8a1-5787f77d521b", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9825976164" },
  { id: 67, tid: "ceaa31e8-8e57-4b16-a823-184439fef4f3", n: "Sanskrutik Guest", p: 1, t: "i", ph: "+91 9825976164" },
];

export interface GuestPassEntry {
  id: number;
  ticketId: string;
  name: string;
  passes: number;
  type: "individual" | "group";
  phone?: string;
}

export const REGISTRY: GuestPassEntry[] = _r.map(e => ({
  id: e.id,
  ticketId: e.tid,
  name: e.n,
  passes: e.p,
  type: e.t === "i" ? "individual" : "group",
  phone: e.ph,
}));

export function normalizePhone(phone: string): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function cleanTicketInput(input: string): string {
  let raw = (input || "").trim();
  try {
    raw = decodeURIComponent(raw);
  } catch (e) {
    // ignore
  }
  if (raw.includes("/pass/")) {
    raw = raw.split("/pass/").pop()?.split("?")[0] || raw;
  } else if (raw.includes("http")) {
    try {
      const url = new URL(raw);
      raw = url.searchParams.get("id") || url.pathname.split("/").pop() || raw;
    } catch (e) {
      // fallback
    }
  }
  return raw.trim();
}

/**
 * Find all guest passes matching a given phone number (checking last 10 digits).
 */
export function findGuestPassesByPhone(phone: string): GuestPassEntry[] {
  const norm = normalizePhone(phone);
  if (!norm || norm.length < 10) return [];
  return REGISTRY.filter(p => p.phone && normalizePhone(p.phone) === norm);
}

/**
 * Find a specific guest pass by full UUID, short ticket ID prefix (>= 6 chars), or unique phone match.
 */
export function findGuestPass(input: string): GuestPassEntry | undefined {
  const clean = cleanTicketInput(input);
  if (!clean) return undefined;

  const lower = clean.toLowerCase();

  // 1. Exact full Ticket ID match
  const exact = REGISTRY.find(p => p.ticketId.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Prefix Ticket ID match (e.g. first 8 characters like "4DA47C4A")
  if (lower.length >= 6) {
    const prefixMatch = REGISTRY.find(p => p.ticketId.toLowerCase().startsWith(lower));
    if (prefixMatch) return prefixMatch;
  }

  // 3. Exact phone match (if only 1 pass matches that phone)
  const phoneMatches = findGuestPassesByPhone(clean);
  if (phoneMatches.length === 1) {
    return phoneMatches[0];
  }

  return undefined;
}

export function isGuestPass(ticketId: string): boolean {
  return findGuestPass(ticketId) !== undefined;
}
