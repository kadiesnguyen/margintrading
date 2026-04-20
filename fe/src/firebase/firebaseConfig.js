// NOTE
// Please use your own firebase details below. For more details visit: https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/development/firebaseIntegration.html

import Vue from "vue";
import firebase from 'firebase/app'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQlMQILg2gKUqv_HS4jCjNke0ih2EsCw0",
    authDomain: "imoba-57b84.firebaseapp.com",
    databaseURL: "https://imoba-57b84.firebaseio.com",
    projectId: "imoba-57b84",
    storageBucket: "imoba-57b84.appspot.com",
    messagingSenderId: "1009510289585",
    appId: "1:1009510289585:web:f86544e6d882ee53b21290",
};


Vue.config.productionTip = false;

firebase.initializeApp(config);
