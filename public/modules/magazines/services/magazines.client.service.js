'use strict';

//Magazines service used to communicate Magazines REST endpoints
angular.module('magazines').factory('Magazines', ['$resource',
	function($resource) {
		return $resource('magazines/:magazineId', { magazineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);