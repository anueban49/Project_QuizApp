import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isPublicRoute = createRouteMatcher([
  "/auth/signin(.*)",
  "/auth/signup(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    alert("sign in/up to access content");
  }
});
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
