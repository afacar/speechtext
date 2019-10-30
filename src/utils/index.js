import ReactGA from 'react-ga';

import * as ActionTypes from './action-types';
import LanguageMap from './language-map';
import Localization from './localization';
import firebase from './firebase';

const addZeroes = (val) => {
    return val.length === 1 ? '0' + val : val;
}

const getNameSurname = (displayName) => {
    let fullName = displayName.trim()
    var index = fullName.lastIndexOf(' ')
    if (index < 0) return [fullName, fullName]
    var name = index > 1 ? fullName.slice(0, index) : '';
    var surname = index > 1 ? fullName.slice(index + 1) : '';
    return [name, surname]
}

export default {
    ActionTypes,
    LanguageMap,
    Localization,
    initGoogleAnalytics: () => {
        ReactGA.initialize('UA-147269515-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    },
    firebase,
    addZeroes,
    getNameSurname,
    formatExpireDate: (expireDate, language) => {
        if (!expireDate) return null;
        var date = new Date(expireDate.seconds * 1000);
        let day = addZeroes(date.getDate());
        let month = addZeroes(date.getMonth() + 1);
        let year = date.getFullYear();
        if (language === 'tr') {
            return day + '/' + month + '/' + year;
        }
        return month + '/' + day + '/' + year;
    }
}