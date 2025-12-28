// Expose build-time secrets (injected via CI/CD) as a single object.
// Keep client-visible values prefixed with NEXT_PUBLIC_ if they should be bundled.
export const secrets = {
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

export default secrets;
