import type { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';

import { createI18n } from 'vue-i18n';
import { setHtmlPageLang, setLoadLocalePool } from './helper';
import { localeSetting } from '@/settings/localeSetting';
import zh_CN from './lang/zh_CN.ts';
import en from './lang/en.ts';

const LANG_CONFIG = {
    zh_CN,
    en
};

const { fallback, availableLocales } = localeSetting;

export let i18n: ReturnType<typeof createI18n>;

async function createI18nOptions(): Promise<I18nOptions> {
    const locale = 'zh_CN';
    const defaultLocal = LANG_CONFIG[locale];
    const message = defaultLocal?.message ?? {};

    setHtmlPageLang(locale);
    setLoadLocalePool((loadLocalePool) => {
        loadLocalePool.push(locale);
    });

    return {
        legacy: false,
        locale,
        fallbackLocale: fallback,
        messages: {
            [locale]: message
        },
        availableLocales: availableLocales,
        sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
        silentTranslationWarn: true, // true - warning off
        missingWarn: false,
        silentFallbackWarn: true
    };
}

// setup i18n instance with glob
export async function setupI18n(app: App) {
    const options = await createI18nOptions();

    i18n = createI18n(options);

    app.use(i18n);
}
