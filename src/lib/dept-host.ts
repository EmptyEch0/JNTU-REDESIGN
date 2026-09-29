const DEPT_SUBDOMAINS: Record<string, string> = {
  it: "it",
  cse: "cse",
  ece: "ece",
  eee: "eee",
  mba: "mba",
  mech: "mech",
  met: "met",
  sh: "bshss",
  civil: "civil",
};

// Paths on a dept subdomain that must NOT be treated as department pages
const PASS_THROUGH = [
  "/api",
  "/_serverFn",
  "/assets",
  "/uploads",
  "/local-assets",
  "/departments/",
];

export function deptFromHostname(host?: string): string | undefined {
  const m = (host || "").toLowerCase().match(/^([a-z]+)\.jntugvcev\.edu\.in$/);
  return m ? DEPT_SUBDOMAINS[m[1]] : undefined;
}

export function isPassThrough(path: string) {
  return PASS_THROUGH.some((p) => path.startsWith(p));
}
