"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import Link from "next/link";

export default function RegisterPage() {
  const { register, loading, error, success } = useRegister();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          type="text"
          placeholder="Nombre de usuario"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.username}
        />

        <input
          name="email"
          type="email"
          placeholder="Correo"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.email}
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded"
          onChange={handleChange}
          value={form.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Creando usuario..." : "Registrarse"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
      {success && <p className="text-green-600 mt-3">{success}</p>}

      {/* Link a login */}
      <p className="mt-4 text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
