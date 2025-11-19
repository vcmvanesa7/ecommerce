// app/api/register/route.ts
import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbconnection";
import { User } from "@/db/models";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    await dbConnection();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Usuario creado correctamente", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
