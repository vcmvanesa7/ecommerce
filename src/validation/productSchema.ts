import * as yup from "yup";

// BACKEND: siempre recibe File real
const fileSchemaBackend = yup
  .mixed<File>()
  .required("La imagen es obligatoria")
  .test("is-file", "Debes subir un archivo válido", (value) => value instanceof File);

// FRONTEND: inicia como null
const fileSchemaFrontend = yup
  .mixed<File>()
  .nullable()
  .transform((value) => {
    if (value === undefined) return null;
    return value;
  })
  .required("La imagen es obligatoria")
  .test("is-file", "Debes seleccionar un archivo válido", (value) => {
    if (value === null) return false;
    return value instanceof File;
  });

export const productSchemaBackend = yup.object({
  nameProduct: yup.string().required().min(2),
  description: yup.string().required().min(5),
  price: yup
    .number()
    .typeError("El precio debe ser un número")
    .required()
    .positive(),
  file: fileSchemaBackend,
});

export const productSchemaFrontend = yup.object({
  nameProduct: yup.string().required().min(2),
  description: yup.string().required().min(5),
  price: yup
    .number()
    .typeError("El precio debe ser un número")
    .required()
    .positive(),
  file: fileSchemaFrontend,
});

// Tipo frontend definido manualmente para permitir null
export type ProductFormDataFrontend = {
  nameProduct: string;
  description: string;
  price: number;
  file: File | null;
};

// Backend sí puede inferirse automáticamente
export type ProductFormDataBackend = yup.InferType<typeof productSchemaBackend>;
