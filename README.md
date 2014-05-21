Angular-complexify v0.3.0 [![Build Status](https://travis-ci.org/Kraku/angular-complexify.svg?branch=master)](https://travis-ci.org/Kraku/angular-complexify)
===============

AngularJS port of [jquery.complexify.js](https://github.com/danpalmer/jquery.complexify.js)

## Installing
```js
var myApp = angular.module('myApp', [
  'angular-complexify'
]);
```

## Usage
In javascript (provider)
```js
myApp.controller('SomeCtrl', ['$scope', 'Complexify', function($scope, Complexify) {
  $scope.test = Complexify('somePassword');
}]);
```

In template (directive)
```html
<input type="text" ng-model="password">

<p ng-show="password">
 <span complexify="password"></span>%,
 <span complexify="password" type="verbal"></span>
</p>
```

## Tests
```
npm install
grunt karma:unit
```
<br>
---
© 2014 [Maciej Podsiedlak](http://mpodsiedlak.com)
