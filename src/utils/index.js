import ReactGA from 'react-ga';

import * as ActionTypes from './action-types';
import Localization from './localization';
import firebase from './firebase';
import * as Sentry from '@sentry/browser';

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

const formatSizeByteToMB = (size) => {
    return (size / 1000000).toFixed(2);
}

const initSentry = () => {
    Sentry.init({ dsn: "https://ebeb898364104068b98c4885204311e5@sentry.io/4240784" });
}

export default {
    ActionTypes,
    Localization,
    initGoogleAnalytics: () => {
        ReactGA.initialize('UA-147269515-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    },
    initSentry,
    firebase,
    addZeroes,
    getNameSurname,
    formatSizeByteToMB,
    formatDateSimpleFormat: (expireDate, language) => {
        if (!expireDate) return null;
        var date = new Date(expireDate.seconds * 1000);
        let day = addZeroes(date.getDate());
        let month = addZeroes(date.getMonth() + 1);
        let year = date.getFullYear();
        if (language === 'tr-TR') {
            return day + '/' + month + '/' + year;
        }
        return month + '/' + day + '/' + year;
    }
}