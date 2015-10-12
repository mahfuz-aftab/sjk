'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Magazines',
	function($scope, Authentication, Magazines) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
			
		var magazines;
		 magazines = 	Magazines.query(function (data) {
		 	//console.log(data[0]);
               	$scope.magazines  = data;
            
		 });
	}
]);