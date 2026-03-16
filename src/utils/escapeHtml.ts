const RE_AMP = /&/g;
const RE_LT = /</g;
const RE_GT = />/g;
const RE_QUOT = /"/g;
const RE_APOS = /'/g;

function escapeHtml(str: string): string {
  return str
    .replace(RE_AMP, "&amp;")
    .replace(RE_LT, "&lt;")
    .replace(RE_GT, "&gt;")
    .replace(RE_QUOT, "&quot;")
    .replace(RE_APOS, "&#039;");
}

export { escapeHtml };
