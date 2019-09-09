import ReactGA from 'react-ga';

import * as ActionTypes from './actionTypes';
import Localization from './localization';
import firebase from './firebase';

export default {
    ActionTypes,
    Localization,
    initGoogleAnalytics: () => {
        ReactGA.initialize('UA-147269515-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    },
    firebase
}