'use strict';

// Magazines controller
angular.module('magazines').controller('MagazinesController', ['$scope', '$stateParams', '$location','$http', 'Authentication', 'Magazines', 'Articles',
	function($scope, $stateParams, $location,$http, Authentication, Magazines, Articles) {
		$scope.authentication = Authentication;

		// Create new Magazine
		$scope.create = function() {
			// Create new Magazine object
			var magazine = new Magazines ({
				name: this.name,
				summary: this.summary,
			//	imageURL: this.imageURL,
				rImageUrl: this.rImageUrl,
				yearNumber: this.yearNumber,
				yearQuarter: this.yearQuarter,
				publishDate: this.publishDate,
				price: this.price
			});

			// Redirect after save
			magazine.$save(function(response) {
				$location.path('magazines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Magazine
		$scope.remove = function(magazine) {
			if ( magazine ) { 
				magazine.$remove();

				for (var i in $scope.magazines) {
					if ($scope.magazines [i] === magazine) {
						$scope.magazines.splice(i, 1);
					}
				}
			} else {
				$scope.magazine.$remove(function() {
					$location.path('magazines');
				});
			}
		};

		// Update existing Magazine
		$scope.update = function() {
			var magazine = $scope.magazine;

			magazine.$update(function() {
				$location.path('magazines/' + magazine._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		     //Add Sale Points in Edit Page
        $scope.addSalePoints = function() {
            var salePoint = {
                'storeName': $scope.storeName,
                'storeLocation': $scope.storeLocation
            };
            
            //$scope.magazine.salePoints.indexOf(salePoint);
            $scope.magazine.salePoints.push(salePoint);
           	
           	$scope.storeName='';
            $scope.storeLocation='';
           
            if (salePoint.length>0) {
            	
            	$scope.addingSalePoints = true;
            }
            
            else {
        	$scope.addingSalePoints = false;
        }
            
           
        };
        
         //clear fields

            $scope.storeName='';
            $scope.storeLocation='';
        
        $scope.removeSalePoints = function(salePoint) {
            var magazine = $scope.magazine;
            var index = magazine.salePoints.indexOf(salePoint);

             $scope.magazine.salePoints.splice(index, 1);
        };
        
		// Find a list of Magazines
		$scope.find = function() {
			$scope.magazines = Magazines.query();
		};
		
		$scope.articlesByMagazine = function() {
		   $http.get('/api/articlesByMagazine').success(function(response) {
                // Show user success message and clear form
                $scope.success = response.message;
                $scope.articleList = response;

            }).error(function(response) {
                // Show user error message and clear form
	console.log(response.message);
                $scope.error = response.message;
            

            });
        };

		// Find existing Magazine
		$scope.findOne = function() {
			$scope.magazine = Magazines.get({ 
				magazineId: $stateParams.magazineId
			});
			
			$scope.articles = Articles.query();
		};
	}
]);