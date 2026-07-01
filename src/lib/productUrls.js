export const ROOT_DOMAIN = "everpoint.ca";

export const PORTAL_LOGIN_URL = "https://portal.everpoint.ca/portal?mode=login";

const PRODUCT_HOSTS = {
  everflow: "https://everflow.everpoint.ca",
  everfield: "https://everfield.everpoint.ca",
};

/**
 * Absolute URL for a product subdomain. The marketing site always links out to
 * production hosts — no same-origin relative URLs.
 */
export function buildProductUrl(product, pathname = "/", search = "", hash = "") {
  const base = PRODUCT_HOSTS[product] || `https://${ROOT_DOMAIN}`;
  return `${base}${pathname}${search}${hash}`;
}
