'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$sce', '$stateParams', '$rootScope', '$location', '$http', 'Authentication', 'Articles', 'Magazines',
	function($scope,$sce, $stateParams, $rootScope, $location, $http, Authentication, Articles, Magazines) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				summary: this.summary,
				content: this.content,
				imageURL: this.imageURL,
				rImageUrl: this.rImageUrl,
				category: this.category,
				magazine: this.magazine
			});
			
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
      $scope.parseArticleContent = function(content) {
            return $sce.trustAsHtml(content);
        };

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		$scope.articlesByCategory = function() {
		   $http.get('/api/articlesByCategory').success(function(response) {
                // Show user success message and clear form
                $scope.success = response.message;
                $scope.articleList = response;
                console.log (response);

            }).error(function(response) {
                // Show user error message and clear form
				 console.log(response);
                $scope.error = response.message;
            

            });
        };

		$scope.find = function() {
			$scope.articles = Articles.query();
			$scope.magazines = Magazines.query();
		};
		

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
			
			$scope.magazines = Magazines.query();
		};
	}
]);


/*		
		-------------------------Image Upload------------------------------------
		    $scope.articleImageUpload = function(url) {
            $scope.imageURL = url + '?decache=' + new Date().getTime();
            $scope.uploadingImage = false;
        };

        $rootScope.$on('uploads', function(event, data) {
            var uploadStatus = data[$scope.folder].msg;
            if (uploadStatus !== 'error') {
                data[$scope.folder].callback(uploadStatus);
            }
        });

        -------------------------File Upload------------------------------------



         $scope.onFileSelect = function($files, folder, callback) {
            $scope.upload = [];
            $scope.folder = folder + '/' + $scope.project._id;
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                file.progress = parseInt(0);
                FileUpload.upload(file, i, $scope.folder, $scope.upload, callback);
            }
        };
         -------------------------File Upload Ends------------------------------------
         
         	$scope.create = function () {
			if (this.photos.length == 0) {
				$scope.photos = [{
					caption: "Caption",
					location: "Location",
					url: 'https://s3-us-west-2.amazonaws.com/suc-web/default/default_img.png',
					date: Date.now()
				}];
			}
*/
