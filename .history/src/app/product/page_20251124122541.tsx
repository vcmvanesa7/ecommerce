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
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function isYupError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export default function CreateProductPage() {
  const { t } = useLanguage();

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

  const handleNumberChange = (value: number) => {
    setForm((prev) => ({ ...prev, price: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({ ...prev, file }));

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
        setIsLoading(false);
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
    <div>
      <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-lg">
        <CardBody className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {t("product.title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t("product.labels.name")}
              name="nameProduct"
              value={form.nameProduct}
              onChange={handleChange}
              variant="bordered"
              size="lg"
              isRequired
              fullWidth
            />

            <Textarea
              label={t("product.labels.description")}
              name="description"
              value={form.description}
              onChange={handleChange}
              variant="bordered"
              size="lg"
              minRows={3}
              isRequired
              fullWidth
            />

            <NumberInput
              label={t("product.labels.price")}
              value={form.price}
              onValueChange={handleNumberChange}
              variant="bordered"
              size="lg"
              min={0}
              isRequired
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("product.labels.file")}
              </label>

              <input
                id="file"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {imagePreview && (
              <div className="flex justify-center mt-2">
                <Card className="w-40">
                  <CardBody className="p-2">
                    <Image
                      src={imagePreview}
                      alt={t("product.preview.alt")}
                      width={160}
                      height={160}
                      className="object-cover rounded"
                    />
                  </CardBody>
                </Card>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              fullWidth
              isDisabled={isLoading}
              startContent={isLoading ? <Spinner size="sm" /> : null}
              className="mt-4"
            >
              {isLoading
                ? t("product.buttons.submitting")
                : t("product.buttons.submit")}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
