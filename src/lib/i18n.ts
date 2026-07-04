import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const resources = {
    en: {
        translation: enTranslations,
    },
    es: {
        translation: esTranslations,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

export type Language = 'es' | 'en';

// Legacy function for backward compatibility
export function getTranslation(lang: Language, key: string): string {
    const keys = key.split('.');
    let value: any = resources[lang].translation;

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}
