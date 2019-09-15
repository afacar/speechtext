import ReactGA from 'react-ga';

import * as ActionTypes from './action-types';
import LanguageMap from './language-map';
import Localization from './localization';
import firebase from './firebase';

export default {
    ActionTypes,
    LanguageMap,
    Localization,
    initGoogleAnalytics: () => {
        ReactGA.initialize('UA-147269515-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    },
    firebase
}