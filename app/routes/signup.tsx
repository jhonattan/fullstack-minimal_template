import { Form, data, redirect } from "react-router";
import type { Route } from "./+types/signup";
import { z } from "zod";
import { createUser } from "../services/auth.service";
import { getSession, commitSession } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate input
  const validation = SignupSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });
  if (!validation.success) {
    return data(
      {
        error: validation.error.issues[0].message,
        fields: { name, email },
      },
      { status: 400 }
    );
  }

  try {
    // Create user
    const user = await createUser({ name, email, password });

    // Create session
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id.toString());
    session.set("email", user.email);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    const errorMessage =
      error.message === "User already exists"
        ? "A user with this email already exists"
        : "An error occurred during signup";

    return data(
      {
        error: errorMessage,
        fields: { name, email },
      },
      { status: 400 }
    );
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

export default function Signup({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;
  const fields = actionData?.fields;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Create your account
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
                label="Full name"
                type="text"
                name="name"
                defaultValue={fields?.name}
                required
                autoComplete="name"
              />

              <Input
                label="Email address"
                type="email"
                name="email"
                defaultValue={fields?.email}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirm password"
                type="password"
                name="confirmPassword"
                required
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full">
                Create account
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Sign in
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
