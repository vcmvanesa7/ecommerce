import axios from "axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function registerService(data: RegisterData) {
  try {
    const res = await axios.post("/api/register", data);
    return res.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error || "Error desconocido en el registro";
    throw new Error(msg);
  }
}
