'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('MyApp'));

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope

  beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;

    // Create mock API
    $httpBackend.expectGET('/api/MyDemoEndpoint')
      .respond(200, []);

    // ignore any requests to main.html
    $httpBackend.expectGET('app/states/main/main.html').respond(200);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  it('should create dummy data on the scope', function() {
    $httpBackend.flush();
    expect(scope.response).to.be.ok;
    expect(scope.response).to.be.instanceOf(Array);
  });


});
