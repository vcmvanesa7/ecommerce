import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbconnection";
import cloudinary from "@/lib/Cloudinary/Cloudinary";
import { Products } from "@/db/models/Products/Products";
import { productSchemaBackend } from "@/validation/productSchema";

interface YupError {
  name: string;
  errors?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Se obtiene el FormData enviado desde el frontend.
    const formData = await request.formData();

    // Campos enviados por el cliente.
    const nameProduct = formData.get("nameProduct");
    const description = formData.get("description");
    const price = formData.get("price");
    const file = formData.get("file") as File;

    // Se convierte el FormData a un objeto tradicional para validarlo con Yup.
    const rawData = {
      nameProduct,
      description,
      price: Number(price),
      file,
    };

    // Validación de los datos con Yup.
    // abortEarly: false permite devolver todos los errores juntos.
    await productSchemaBackend.validate(rawData, { abortEarly: false });

    // Conversión del archivo a Data URI para Cloudinary.
    const buffer = await file.arrayBuffer();
    const dataUri = `data:${file.type};base64,${Buffer.from(buffer).toString(
      "base64"
    )}`;

    // Subida de la imagen a Cloudinary.
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "ecommerce/products",
      resource_type: "image",
    });

    // Conexión a la base de datos.
    await dbConnection();

    // Creación del nuevo documento de producto.
    const newProduct = new Products({
      nameProduct,
      description,
      price,
      fileUrl: uploadResult.secure_url,
    });

    // Guardado del producto en MongoDB.
    const savedProduct = await newProduct.save();

    // Respuesta exitosa.
    return NextResponse.json(
      {
        success: true,
        message: "Producto creado correctamente",
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Manejo de errores provenientes de Yup.
    if ((error as YupError).name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validación fallida",
          errors: (error as YupError).errors,
        },
        { status: 400 }
      );
    }

    // Manejo de errores inesperados.
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
