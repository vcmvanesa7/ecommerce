// src/proxy.ts
import { auth } from "@/auth";

export default auth; // <-- ESTE es el correcto en v5

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
