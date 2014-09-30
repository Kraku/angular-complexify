'use strict';
 
describe('Complexify provider', function() {
  var complexify, complexifyProvider;

  beforeEach(module('angular-complexify', function(ComplexifyProvider) {
    complexifyProvider = ComplexifyProvider;
  }));

  beforeEach(inject(function($injector) {
    complexify = $injector.get('Complexify');
  }));    

  it('should be able to update options', function() {
    expect(complexifyProvider.getOptions('minimumChars')).toBe(8);
    expect(complexifyProvider.getOptions('strengthScaleFactor')).toBe(1);
    expect(complexifyProvider.getOptions('bannedPasswords').length).toBe(521);

    complexifyProvider.setOptions('minimumChars', 1);
    complexifyProvider.setOptions('strengthScaleFactor', 2);
    complexifyProvider.setOptions('bannedPasswords', ['foo', 'bar']);

    expect(complexifyProvider.getOptions('minimumChars')).toBe(1);
    expect(complexifyProvider.getOptions('strengthScaleFactor')).toBe(2);
    expect(complexifyProvider.getOptions('bannedPasswords').length).toBe(2);
  });

  it('should return additional complexity for charset', function() {
    expect(complexifyProvider.additionalComplexityForCharset('foo123', [0x0030, 0x0039])).toBe(10);
    expect(complexifyProvider.additionalComplexityForCharset('foobar', [0x0030, 0x0039])).toBe(0);
  });

  it('should return true if value exists in array', function() {
    expect(complexifyProvider.inBanlist('password')).toBe(true);
    expect(complexifyProvider.inBanlist('321456987')).toBe(false);
  });

  it('should return evaluate security value', function() {
    expect(complexifyProvider.evaluateSecurity().complexity).toBe(0);
    expect(complexifyProvider.evaluateSecurity('password').complexity).toBe(0);
    expect(complexifyProvider.evaluateSecurity('321456987').complexity).toBe(17.269388197455342);
    expect(complexifyProvider.evaluateSecurity('abcfoobar').complexity).toBe(24.435724035161112);
    expect(complexifyProvider.evaluateSecurity('abc123bar').complexity).toBe(26.87639203842082);
    expect(complexifyProvider.evaluateSecurity('123fsd4tSDidUguvI4ebtvew').complexity).toBe(82.54268770090182);
  });
});

describe('Complexify directive', function () {
  var scope, element, compile;

  beforeEach(module('angular-complexify'));

  beforeEach(inject(function ($rootScope, $compile, $templateCache) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  it('should return percent complexity', function() {
    scope.inputModel = 'abc123bar';
    element = compile('<span complexify="inputModel"></span>')(scope);

    scope.$digest();

    expect(element.text()).toBe('26');
  });

  it('should return verbal complexity', function() {
    scope.inputModel = 'abc123bar';
    element = compile('<span complexify="inputModel" type="verbal"></span>')(scope);

    scope.$digest();

    expect(element.text()).toBe('Fair');
  });
});

describe('Complexify validation directive', function () {
  var scope, element, compile;

  beforeEach(module('angular-complexify'));

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  it('should start with valid and pristine', function() {
    element = compile('<form name="form"><input name="password" type="text" ng-model="password" complexify-validate></form>')(scope);

    scope.$digest();

    expect(element.hasClass('ng-pristine')).toBeTruthy();
    expect(element.hasClass('ng-valid')).toBeTruthy();
  });

  it('should set ng-invalid-password-complexity when password is not complex enough', function() {
    element = compile('<form name="form"><input name="password" type="text" ng-model="password" complexify-validate></form>')(scope);
    scope.$digest();

    scope.form.password.$setViewValue('1234567890');
    scope.$digest();

    expect(element.hasClass('ng-pristine')).toBeFalsy();
    expect(element.hasClass('ng-valid')).toBeFalsy();

    expect(element.hasClass('ng-dirty')).toBeTruthy();
    expect(element.hasClass('ng-invalid')).toBeTruthy();
    expect(element.hasClass('ng-invalid-password-complexity')).toBeTruthy();
  });

  it('should remove ng-invalid-password-complexity when password is valid', function() {
    element = compile('<form name="form"><input name="password" type="text" ng-model="password" complexify-validate></form>')(scope);
    scope.$digest();

    scope.form.password.$setViewValue('1234567890');
    scope.$digest();

    expect(element.hasClass('ng-pristine')).toBeFalsy();
    expect(element.hasClass('ng-valid')).toBeFalsy();

    expect(element.hasClass('ng-dirty')).toBeTruthy();
    expect(element.hasClass('ng-invalid')).toBeTruthy();
    expect(element.hasClass('ng-invalid-password-complexity')).toBeTruthy();

    scope.form.password.$setViewValue('1234567890Abdelieaelieaelie)(');
    scope.$digest();

    expect(element.hasClass('ng-valid')).toBeTruthy();
    expect(element.hasClass('ng-valid-password-complexity')).toBeTruthy();
  });

  it('should be able to customize complexity', inject(function(Complexify) {
    var passwordLessThan40 = 'ABCdefGHI12', passwordMoreThan40 = 'ABCdefGHI123', threshold = 40;
    element = compile('<form name="form"><input name="password" type="text" ng-model="password" complexify-validate="' + threshold + '"></form>')(scope);
    scope.$digest();

    scope.form.password.$setViewValue(passwordLessThan40);
    scope.$digest();

    expect(element.hasClass('ng-pristine')).toBeFalsy();
    expect(element.hasClass('ng-valid')).toBeFalsy();

    expect(element.hasClass('ng-dirty')).toBeTruthy();
    expect(element.hasClass('ng-invalid')).toBeTruthy();
    expect(element.hasClass('ng-invalid-password-complexity')).toBeTruthy();
    expect(Complexify(passwordLessThan40).complexity).toBeLessThan(threshold);

    scope.form.password.$setViewValue(passwordMoreThan40);
    scope.$digest();

    expect(element.hasClass('ng-valid')).toBeTruthy();
    expect(element.hasClass('ng-valid-password-complexity')).toBeTruthy();
    expect(Complexify(passwordMoreThan40).complexity).toBeGreaterThan(threshold);
  }));
});

describe('Complexify filter', function () {
  var filter;

  beforeEach(module('angular-complexify'));

  beforeEach(inject(function (complexifyFilter) {
    filter = complexifyFilter;
  }));

  it('should be greater than zero', function() {
    expect(filter('1a2b3c4d5e6f7g8h9i')).toBeGreaterThan(0);
  });
});
