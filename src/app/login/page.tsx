"use client";

import { useState } from "react";
import { loginService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const result = await loginService(email, password);

    // NextAuth v5 cuando credenciales fallan:
    // result = { error: "CredentialsSignin", status: 401, ok: false }
    if (!result || result.error) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo"
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
