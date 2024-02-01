
// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {

  return (
    <html lang="en">
      <body>
        <div>Something went wrong</div>
      </body>
    </html>
  );
}
