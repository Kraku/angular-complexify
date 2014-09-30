Angular-complexify v0.3.4 [![Build Status](https://travis-ci.org/Kraku/angular-complexify.svg?branch=master)](https://travis-ci.org/Kraku/angular-complexify)
===============
#### password strength validation
AngularJS port of [jquery.complexify.js](https://github.com/danpalmer/jquery.complexify.js)

## Installing
```js
var myApp = angular.module('myApp', [
  'angular-complexify'
]);
```

## Usage
##### Provider
```js
myApp.controller('SomeCtrl', ['$scope', 'Complexify', function($scope, Complexify) {
  $scope.complexify = Complexify('somePassword');
}]);
```

##### Standard directive
```html
<input type="text" ng-model="password">

<p ng-show="password">
 <span complexify="password"></span>%,
 <span complexify="password" type="verbal"></span>
</p>
```

##### Validation directive
```html
<form name="form">
  <input name="password" type="password" ng-model="password" complexify-validate="60">
</form>
```

ng-invalid-password-complexity or ng-valid-password-complexity is added as user types. Above example sets 60% complexity as threshold.

##### Filter (ui-bootstrap progressbar)
```html
<progressbar value="password | complexify"></progressbar>
```

## Tests
```
npm install
grunt karma:unit
```
<br>
---
© 2014 [Maciej Podsiedlak](http://mpodsiedlak.com) (WTFPL v2 licence)
