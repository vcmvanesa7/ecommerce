"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Spinner,
  Input,
  Textarea,
  Card,
  CardBody,
  Button,
  NumberInput
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      file,
    }));

    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

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
        setForm({ nameProduct: "", description: "", price: 0, file: null });
        setImagePreview(null);
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
<Card className="max-w-2xl mx-auto mt-6 shadow-lg">
  <CardBody className="p-6">
    <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>

    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <Input
          label="Nombre del producto *"
          name="nameProduct"
          value={form.nameProduct}
          onChange={handleChange}
          variant="bordered"
          size="lg"
          isRequired
        />

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

        <NumberInput
          label="Precio *"
          value={form.price}
          onValueChange={(value: number) =>
            setForm((prev) => ({ ...prev, price: value }))
          }
          variant="bordered"
          size="lg"
          min={0}
          isRequired
        />

        <div>
          <label className="block text-sm font-medium mb-1">Archivo *</label>
          <input
            id="file"
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

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
      </div>
    </form>
  </CardBody>
</Card>

  );
}
