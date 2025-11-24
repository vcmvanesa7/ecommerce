import type { DictionarySection, HomeDictionary } from "@/types/dictionaries";

export type Locales = "es" | "en";
export type Sections = "home" | "nav" | "contact" | "projects";

// Función que retorna el tipo correcto según la sección
export const getDictionary = async (
  locale: Locales,
  section: Sections
): Promise<HomeDictionary | DictionarySection> => {
  const dictionaries = {
    es: {
      home: () => import("./home/es.json").then((mod) => mod.default as HomeDictionary),
  
    },
    en: {
      home: () => import("./home/en.json").then((mod) => mod.default as HomeDictionary),
      
    },
  };

  if (!locale || !dictionaries[locale]) {
    throw new Error(`❌ Locale "${locale}" not found in dictionaries`);
  }
  if (!section || !dictionaries[locale][section]) {
    throw new Error(`❌ Section "${section}" not found for locale "${locale}"`);
  }

  return dictionaries[locale][section]();
};