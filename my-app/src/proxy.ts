import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/auth/signin(.*)",
  "/auth/signup(.*)",
]);
//it runs on every request, and only attaching the userId in the header should take care of the most issues with api calls.
export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    alert("sign in/up to access content");
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
