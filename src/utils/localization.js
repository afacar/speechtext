import _ from 'lodash';
import messages_tr from "../translations/tr.json";
import messages_en from "../translations/en.json";

import LanguagageCodes from './language-codes';

if (!Intl.PluralRules) {
    require('intl-pluralrules');
}

// if (!Intl.RelativeTimeFormat) {
//     require('@formatjs/intl-relativetimeformat/polyfill');
//     require('@formatjs/intl-relativetimeformat/dist/include-aliases');
// }

const messages = {
    'tr-TR': messages_tr,
    'en-US': messages_en
};
var currentLanguage = navigator.language.split(/[-_]/)[0];

if(!_.has(messages, currentLanguage)) {
    currentLanguage = 'en-US'
}

export default {
    supportedLanguages: LanguagageCodes,
    currentLanguage,
    messages
}