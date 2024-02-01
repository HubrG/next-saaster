export const dynamic = "force-dynamic";
import { unstable_setRequestLocale } from "next-intl/server";

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
    unstable_setRequestLocale("en");

  return (
    <html lang="en">
      <body>
        <div>Something went wrong</div>
      </body>
    </html>
  );
}
