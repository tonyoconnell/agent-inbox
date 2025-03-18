export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "password",
      validatePassword: async (password: string) => {
        // In a real app, you'd want to enforce password strength
        return true;
      },
    },
  ],
};
