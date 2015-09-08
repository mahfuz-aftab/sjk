'use strict';

(function() {
	// Magazines Controller Spec
	describe('Magazines Controller Tests', function() {
		// Initialize global variables
		var MagazinesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Magazines controller.
			MagazinesController = $controller('MagazinesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Magazine object fetched from XHR', inject(function(Magazines) {
			// Create sample Magazine using the Magazines service
			var sampleMagazine = new Magazines({
				name: 'New Magazine'
			});

			// Create a sample Magazines array that includes the new Magazine
			var sampleMagazines = [sampleMagazine];

			// Set GET response
			$httpBackend.expectGET('magazines').respond(sampleMagazines);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.magazines).toEqualData(sampleMagazines);
		}));

		it('$scope.findOne() should create an array with one Magazine object fetched from XHR using a magazineId URL parameter', inject(function(Magazines) {
			// Define a sample Magazine object
			var sampleMagazine = new Magazines({
				name: 'New Magazine'
			});

			// Set the URL parameter
			$stateParams.magazineId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/magazines\/([0-9a-fA-F]{24})$/).respond(sampleMagazine);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.magazine).toEqualData(sampleMagazine);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Magazines) {
			// Create a sample Magazine object
			var sampleMagazinePostData = new Magazines({
				name: 'New Magazine'
			});

			// Create a sample Magazine response
			var sampleMagazineResponse = new Magazines({
				_id: '525cf20451979dea2c000001',
				name: 'New Magazine'
			});

			// Fixture mock form input values
			scope.name = 'New Magazine';

			// Set POST response
			$httpBackend.expectPOST('magazines', sampleMagazinePostData).respond(sampleMagazineResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Magazine was created
			expect($location.path()).toBe('/magazines/' + sampleMagazineResponse._id);
		}));

		it('$scope.update() should update a valid Magazine', inject(function(Magazines) {
			// Define a sample Magazine put data
			var sampleMagazinePutData = new Magazines({
				_id: '525cf20451979dea2c000001',
				name: 'New Magazine'
			});

			// Mock Magazine in scope
			scope.magazine = sampleMagazinePutData;

			// Set PUT response
			$httpBackend.expectPUT(/magazines\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/magazines/' + sampleMagazinePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid magazineId and remove the Magazine from the scope', inject(function(Magazines) {
			// Create new Magazine object
			var sampleMagazine = new Magazines({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Magazines array and include the Magazine
			scope.magazines = [sampleMagazine];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/magazines\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMagazine);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.magazines.length).toBe(0);
		}));
	});
}());