import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { getSession, commitSession } from "./lib/auth";
import { getUserById } from "./services/auth.service";
import "./globals.css";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  let user = null;
  if (userId) {
    try {
      user = await getUserById(userId);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return data(
    { user },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Layout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    FullStack Store
                  </a>
                </div>
                <nav className="flex items-center space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Home
                  </a>
                  <a
                    href="/products"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Products
                  </a>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Hi, {user.name}!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <a
                        href="/login"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Login
                      </a>
                      <a
                        href="/signup"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Sign up
                      </a>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>

          <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <p>&copy; 2024 FullStack Store. Made with ❤️ for developers.</p>
              </div>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
