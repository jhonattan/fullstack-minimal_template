import { Form, data, redirect } from "react-router";
import type { Route } from "./+types/login";
import { z } from "zod";
import { authenticateUser } from "../services/auth.service";
import { getSession, commitSession } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input
  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return data({ error: validation.error.issues[0].message }, { status: 400 });
  }

  try {
    // Authenticate user
    const user = await authenticateUser({ email, password });

    if (!user) {
      return data({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create session
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id.toString());
    session.set("email", user.email);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return data({ error: "An error occurred during login" }, { status: 500 });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if user is already logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (userId) {
    throw redirect("/");
  }

  return data({});
}

export default function Login({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                name="email"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />

              <Button type="submit" className="w-full">
                Sign in
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
