"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Spinner,
  Input,
  Textarea,
  Card,
  CardBody,
  Button,
  NumberInput,
} from "@heroui/react";
import Image from "next/image";
import { createProduct } from "@/services/product";
import { notification } from "@/utils/notification";
import {
  productSchemaFrontend,
  ProductFormDataFrontend,
} from "@/validation/productSchema";
import { ValidationError } from "yup";
import { HttpError } from "@/types/HttpError";

function isYupError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export default function CreateProductPage() {
  const [form, setForm] = useState<ProductFormDataFrontend>({
    nameProduct: "",
    description: "",
    price: 0,
    file: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manejo de inputs de texto
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Manejo de archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      file,
    }));

    if (!file) {
      setImagePreview(null);
      return;
    }

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Submit con Yup
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await productSchemaFrontend.validate(form, { abortEarly: false });

      if (!form.file) {
        notification("Debes seleccionar un archivo", "error");
        return;
      }

      const res = await createProduct({
        nameProduct: form.nameProduct,
        description: form.description,
        price: Number(form.price),
        file: form.file,
      });

      if (res.success) {
        notification("Producto creado correctamente", "success");

        setForm({
          nameProduct: "",
          description: "",
          price: 0,
          file: null,
        });
        setImagePreview(null);

        const inputFile = document.getElementById("file") as HTMLInputElement;
        if (inputFile) inputFile.value = "";
      } else if (res.errors) {
        res.errors.forEach((msg) => notification(msg, "error"));
      }
    } catch (err: unknown) {
      if (isYupError(err)) {
        err.inner.forEach((e) => notification(e.message, "error"));
        return;
      }

      const httpError = err as HttpError;
      notification(
        httpError?.response?.data?.message || "Error al crear producto",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Nombre */}
        <Input
          label="Nombre del producto *"
          name="nameProduct"
          value={form.nameProduct}
          onChange={handleChange}
          variant="bordered"
          size="lg"
          isRequired
        />

        {/* Descripción */}
        <Textarea
          label="Descripción *"
          name="description"
          value={form.description}
          onChange={handleChange}
          variant="bordered"
          size="lg"
          minRows={3}
          isRequired
        />
        {/* Precio */}
<NumberInput
  label="Precio *"
  value={form.price}
  onValueChange={(value: number) =>
    setForm((prev) => ({
      ...prev,
      price: value,
    }))
  }
  variant="bordered"
  size="lg"
  min={0}
  isRequired
/>


        {/* Archivo */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Archivo *</label>
          <input
            id="file"
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Previsualización */}
        {imagePreview && (
          <Card className="w-40">
            <CardBody className="p-2">
              <Image
                src={imagePreview}
                alt="preview"
                width={160}
                height={160}
                className="object-cover rounded"
              />
            </CardBody>
          </Card>
        )}

        {/* Botón HeroUI */}
        <Button
          type="submit"
          color="primary"
          size="lg"
          fullWidth
          isDisabled={isLoading}
          startContent={isLoading ? <Spinner size="sm" /> : null}
        >
          {isLoading ? "Creando..." : "Crear Producto"}
        </Button>
      </form>
    </div>
  );
}
