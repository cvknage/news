import * as angular from 'angular';
import * as ngMaterial from 'angular-material';

import 'angular-ui-router';
import 'angularfire';

import greeter from './components/greeting/greeting-module';
import { IGreetingProvider } from './components/greeting/greeting-service';

export const app = angular.module('typeScriptTest', ['ui.router', 'firebase', ngMaterial, greeter]);

class Config {
    constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $stateProvider
        .state('user', {
            url: '/user',
            template: '<user-component></user-component>'
        })
        .state('news', {
            url: '/news',
            template: '<news-component></news-component>'
        });
        $urlRouterProvider.otherwise('/news');
    }
}

class MaterialConfig {
    constructor($mdThemingProvider: ng.material.IThemingProvider, $compileProvider: ng.ICompileProvider) {
        $mdThemingProvider.alwaysWatchTheme(true);
    }
}

class GreetingConfig {
    constructor(greetingServiceProvider: IGreetingProvider) {
        greetingServiceProvider.setGreeting('Howdy! ');
    }
}

app.config(Config);
app.config(MaterialConfig);
app.config(GreetingConfig);
