import axios from "axios";

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    nameProduct: string;
    description: string;
    price: number;
    fileUrl: string;
    createdAt: string;
    __v?: number; // mongoose lo agrega
  };
  errors?: string[]; // Para errores de Yup
}


export interface CreateProductData {
  nameProduct: string;
  description: string;
  price: number;
  file: File;
}

export const createProduct = async (
  productData: CreateProductData
): Promise<CreateProductResponse> => {
  try {
    const formData = new FormData();

    formData.append("nameProduct", productData.nameProduct);
    formData.append("description", productData.description);
    formData.append("price", String(productData.price)); // price llega como string en FormData
    formData.append("file", productData.file);

    const response = await axios.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as CreateProductResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Tu API devuelve errores de Yup así:
      // { success: false, message: "Validación fallida", errors: [...] }
      if (error.response) {
        return error.response.data as CreateProductResponse;
      }
    }

    throw new Error("Error desconocido al crear producto");
  }
};
