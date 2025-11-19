import { signIn } from "next-auth/react";

export async function loginService(email: string, password: string) {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false, // importante
  });

  return res; // devuelve { ok, error, status }
}