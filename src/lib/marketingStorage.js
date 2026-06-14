const INSTALL_KEYS = {
  everflow: "everpoint_marketing_install_everflow",
  everfield: "everpoint_marketing_install_everfield",
};

export const MARKETING_STORAGE = {
  installClickedEverflow: INSTALL_KEYS.everflow,
  installClickedEverfield: INSTALL_KEYS.everfield,
};

export function readMarketingFlag(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeMarketingFlag(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safari private mode — non-fatal.
  }
}
