// Lovable integration disabled for Vercel deployment.
// @lovable.dev/cloud-auth-js is not available during production build.

export const lovable = {
  auth: {
    signInWithOAuth: async () => {
      return {
        error: new Error("Lovable OAuth is disabled in production."),
      };
    },
  },
};
