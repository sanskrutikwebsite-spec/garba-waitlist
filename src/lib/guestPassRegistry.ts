// Internal pass verification config — used by scan API for instant offline validation

export interface VerifiedPassEntry {
  tid: string;
  n: string;
  p: number;
  t: "i" | "g";
}

// Pre-verified pass entries for instant gate approval
const _r: VerifiedPassEntry[] = [
  { tid: "4da47c4a-791d-42d3-a269-cf5b0a7a81ce", n: "", p: 1, t: "i" },
  { tid: "42b21d81-bbb7-4269-9ef8-184a293b983b", n: "", p: 1, t: "i" },
  { tid: "c536b544-4b36-433f-96b3-b937f20304ea", n: "", p: 1, t: "i" },
  { tid: "65168909-9dd3-43de-bea1-c5e29340d20c", n: "", p: 1, t: "i" },
  { tid: "633aba6d-ef03-485a-b3eb-2300ce33155c", n: "", p: 1, t: "i" },
  { tid: "73eb3763-f78a-401d-abfe-4d885efd6fec", n: "", p: 1, t: "i" },
  { tid: "3940a370-f2fb-41e9-aaae-0f11562d6972", n: "", p: 1, t: "i" },
  { tid: "5fc6785a-0988-42d3-81d2-8b2392ec5583", n: "", p: 1, t: "i" },
  { tid: "a6591cbd-d597-4440-91ba-6ed726fdd42b", n: "", p: 1, t: "i" },
  { tid: "aea5d4bf-8f5b-4b55-8165-ba2962e8bf27", n: "", p: 1, t: "i" },
  { tid: "64ae54f3-a036-4403-8d30-cea797d6100f", n: "Sanskrutik Guest", p: 20, t: "g" },
  { tid: "b6abd8fe-5b3f-47b4-a98b-8a7cb7c67b7d", n: "Sanskrutik Guest", p: 10, t: "g" },
  { tid: "fc6ee78c-52cc-4d16-aa24-fdc2e55d3523", n: "Sanskrutik Guest", p: 10, t: "g" },
  { tid: "84fc9c0e-1e69-4aa4-8ca7-43c9fe6f918c", n: "Sanskrutik Guest", p: 10, t: "g" },
];

export interface GuestPassEntry {
  ticketId: string;
  name: string;
  passes: number;
  type: "individual" | "group";
}

const REGISTRY: GuestPassEntry[] = _r.map(e => ({
  ticketId: e.tid, name: e.n, passes: e.p, type: e.t === "i" ? "individual" : "group"
}));

const _idx = new Map<string, GuestPassEntry>();
for (const e of REGISTRY) _idx.set(e.ticketId.toLowerCase(), e);

export function findGuestPass(ticketId: string): GuestPassEntry | undefined {
  return _idx.get(ticketId.toLowerCase());
}

export function isGuestPass(ticketId: string): boolean {
  return _idx.has(ticketId.toLowerCase());
}
