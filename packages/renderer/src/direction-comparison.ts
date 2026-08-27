export const DIRECTION_PREVIEW_CANVAS = { width: 1242, height: 1660 } as const;
export const DIRECTION_CONTACT_SHEET_CANVAS = { width: 2400, height: 1180 } as const;

export type DirectionComparisonKey = "A" | "B" | "C";

export interface DirectionPreviewHtmlInput {
  candidate: DirectionComparisonKey;
  title: string;
  body: string;
  backgroundDataUri?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertPlainApprovedCopy(title: string, body: string): void {
  for (const value of [title, body]) {
    if (!value.trim() || /<(script|style|iframe|object|embed)|onload\s*=|onclick\s*=/iu.test(value))
      throw new Error("DIRECTION_PREVIEW_COPY_INVALID");
  }
}

function assertBackground(candidate: DirectionComparisonKey, backgroundDataUri?: string): void {
  if (
    (candidate === "A" || candidate === "C") &&
    !backgroundDataUri?.startsWith("data:image/png;base64,")
  )
    throw new Error(`DIRECTION_PREVIEW_BACKGROUND_REQUIRED:${candidate}`);
  if (candidate === "B" && backgroundDataUri)
    throw new Error("PURE_TYPOGRAPHY_BACKGROUND_FORBIDDEN");
}

const baseCss = `
  * { box-sizing: border-box; }
  html, body { width:1242px; height:1660px; margin:0; overflow:hidden; }
  body { font-family:"PingFang SC","Noto Sans CJK SC",sans-serif; -webkit-font-smoothing:antialiased; }
  .canvas { position:relative; width:1242px; height:1660px; overflow:hidden; }
  [data-approved-copy] { position:absolute; z-index:3; margin:0; }
`;

export function buildDirectionPreviewHtml(input: DirectionPreviewHtmlInput): string {
  assertPlainApprovedCopy(input.title, input.body);
  assertBackground(input.candidate, input.backgroundDataUri);
  const title = escapeHtml(input.title);
  const body = escapeHtml(input.body);
  const titleMarkup = title.replace("“专业”", '<span class="nowrap">“专业”</span>');

  if (input.candidate === "A")
    return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .nowrap { white-space:nowrap; }
      .canvas { color:#17212a; background:#eee5d7 url('${input.backgroundDataUri}') 0 0/100% 100% no-repeat; }
      .veil { position:absolute; inset:0; background:linear-gradient(90deg,rgba(246,240,230,.97) 0%,rgba(246,240,230,.88) 39%,rgba(246,240,230,.18) 66%,rgba(246,240,230,0) 80%); }
      .accent { position:absolute; z-index:2; left:84px; top:108px; width:72px; height:5px; background:#a77d49; }
      .title { left:84px; top:165px; width:650px; padding-bottom:12px; font-size:108px; line-height:1.12; letter-spacing:-.055em; font-weight:700; }
      .body { left:91px; top:585px; width:570px; padding-top:38px; border-top:2px solid rgba(107,83,53,.72); color:#35414a; font-size:34px; line-height:1.62; letter-spacing:.005em; font-weight:450; }
      .anchor { position:absolute; z-index:2; left:84px; bottom:92px; width:8px; height:174px; background:#a77d49; opacity:.82; }
    </style></head><body><main class="canvas"><div class="veil"></div><div class="accent"></div><h1 class="title" data-approved-copy="title">${titleMarkup}</h1><p class="body" data-approved-copy="body">${body}</p><div class="anchor"></div></main></body></html>`;

  if (input.candidate === "B")
    return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .nowrap { white-space:nowrap; }
      .canvas { color:#171717; background:#f2ede4; }
      .rail { position:absolute; inset:0 auto 0 0; width:24px; background:#d45f3c; }
      .title { left:84px; top:150px; width:1010px; padding-bottom:28px; font-size:132px; line-height:1.06; letter-spacing:-.065em; font-weight:760; }
      .body { left:91px; top:650px; width:760px; padding-top:42px; border-top:4px solid #171717; font-size:36px; line-height:1.62; letter-spacing:0; font-weight:470; }
      .circle { position:absolute; right:-126px; bottom:172px; width:520px; height:520px; border:92px solid #d45f3c; border-radius:50%; }
      .bar { position:absolute; left:91px; bottom:104px; width:260px; height:13px; background:#171717; }
    </style></head><body><main class="canvas"><div class="rail"></div><h1 class="title" data-approved-copy="title">${titleMarkup}</h1><p class="body" data-approved-copy="body">${body}</p><div class="circle"></div><div class="bar"></div></main></body></html>`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .nowrap { white-space:nowrap; }
    .canvas { color:#eee9df; background:#101c28 url('${input.backgroundDataUri}') 0 0/100% 100% no-repeat; }
    .shade { position:absolute; inset:0; background:linear-gradient(180deg,rgba(7,17,27,.54) 0%,rgba(7,17,27,.16) 46%,rgba(7,17,27,.72) 100%); }
    .frame { position:absolute; z-index:2; left:66px; top:74px; width:902px; height:684px; border-left:3px solid #bd7651; border-top:3px solid #bd7651; }
    .title { left:92px; top:118px; width:820px; padding-bottom:24px; font-size:104px; line-height:1.12; letter-spacing:-.052em; font-weight:720; text-shadow:0 3px 22px rgba(0,0,0,.38); }
    .body-panel { position:absolute; z-index:2; left:66px; bottom:100px; width:810px; min-height:350px; background:rgba(8,19,29,.80); border-top:3px solid #bd7651; backdrop-filter:blur(12px); }
    .body { left:102px; bottom:163px; width:708px; color:#dedbd4; font-size:34px; line-height:1.64; letter-spacing:.002em; font-weight:450; }
    .node { position:absolute; z-index:2; right:112px; bottom:150px; width:176px; height:176px; border:2px solid rgba(210,183,159,.62); transform:rotate(45deg); }
  </style></head><body><main class="canvas"><div class="shade"></div><div class="frame"></div><h1 class="title" data-approved-copy="title">${titleMarkup}</h1><div class="body-panel"></div><p class="body" data-approved-copy="body">${body}</p><div class="node"></div></main></body></html>`;
}

export function buildDirectionContactSheetHtml(input: {
  previews: Array<{ candidate: DirectionComparisonKey; candidateId: string; dataUri: string }>;
}): string {
  if (input.previews.length !== 3) throw new Error("DIRECTION_CONTACT_SHEET_REQUIRES_THREE");
  const seen = new Set(input.previews.map((preview) => preview.candidate));
  if (seen.size !== 3 || !["A", "B", "C"].every((key) => seen.has(key as DirectionComparisonKey)))
    throw new Error("DIRECTION_CONTACT_SHEET_KEYS_INVALID");
  const cards = input.previews
    .map(
      (preview) =>
        `<section class="card"><div class="label"><b>${escapeHtml(preview.candidate)}</b><span>${escapeHtml(preview.candidateId)}</span></div><img src="${preview.dataUri}" alt="" /></section>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing:border-box; }
    html, body { width:2400px; height:1180px; margin:0; overflow:hidden; }
    body { background:#e8e7e3; font-family:"PingFang SC","Noto Sans CJK SC",sans-serif; }
    main { display:grid; grid-template-columns:repeat(3, 675px); gap:74px; width:2173px; margin:58px auto 0; }
    .card { width:675px; }
    .label { height:82px; display:flex; align-items:center; gap:22px; color:#1a1d20; }
    .label b { display:grid; place-items:center; width:52px; height:52px; border-radius:50%; color:#fff; background:#1b2025; font-size:26px; }
    .label span { font:600 24px/1 monospace; letter-spacing:.03em; }
    img { display:block; width:675px; height:900px; object-fit:contain; background:#fff; box-shadow:0 16px 42px rgba(16,22,28,.14); }
  </style></head><body><main>${cards}</main></body></html>`;
}
