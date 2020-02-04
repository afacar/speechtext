import _ from 'lodash';
import messages_tr from "../translations/tr.json";
import messages_en from "../translations/en.json";

if (!Intl.PluralRules) {
    require('intl-pluralrules');
}

// if (!Intl.RelativeTimeFormat) {
//     require('@formatjs/intl-relativetimeformat/polyfill');
//     require('@formatjs/intl-relativetimeformat/dist/include-aliases');
// }

const supportedLanguages = [
    {
        key: 'tr',
        value: 'Türkçe'
    },
    {
        key: 'en',
        value: 'English'
    },
    {
        key: 'es',
        value: 'Español'
    },
    {
        key: 'ru',
        value: 'Русский'
    },
    {
        key: 'ar',
        value: 'العربية'
    }
];

const messages = {
    'tr': messages_tr,
    'en': messages_en
};
var currentLanguage = navigator.language.split(/[-_]/)[0];

if(!_.has(messages, currentLanguage)) {
    currentLanguage = 'en'
}

export default {
    supportedLanguages,
    currentLanguage,
    messages
}