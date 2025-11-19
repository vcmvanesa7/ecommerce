"use client";
import { useState } from "react";
import { registerService, RegisterData } from "@/services/registerService";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await registerService(data);
      setSuccess(res.message);

      return res;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    success,
  };
}
