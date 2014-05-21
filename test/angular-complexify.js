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
