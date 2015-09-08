'use strict';

//Setting up route
angular.module('magazines').config(['$stateProvider',
	function($stateProvider) {
		// Magazines state routing
		$stateProvider.
		state('listMagazines', {
			url: '/magazines',
			templateUrl: 'modules/magazines/views/list-magazines.client.view.html'
		}).
		state('createMagazine', {
			url: '/magazines/create',
			templateUrl: 'modules/magazines/views/create-magazine.client.view.html'
		}).
		state('viewMagazine', {
			url: '/magazines/:magazineId',
			templateUrl: 'modules/magazines/views/view-magazine.client.view.html'
		}).
		state('editMagazine', {
			url: '/magazines/:magazineId/edit',
			templateUrl: 'modules/magazines/views/edit-magazine.client.view.html'
		});
	}
]);