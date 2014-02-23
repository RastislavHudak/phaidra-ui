var app = angular.module('frontendApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ajoslin.promise-tracker', 'directoryService', 'metadataService']);

var ModalInstanceCtrl = function ($scope, $modalInstance, DirectoryService, promiseTracker) {
		
	$scope.user = {username: '', password: ''};
	$scope.alerts = [];   
	
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.hitEnter = function(evt){
    	if(angular.equals(evt.keyCode,13) 
    			&& !(angular.equals($scope.user.username,null) || angular.equals($scope.user.username,''))
    			&& !(angular.equals($scope.user.password,null) || angular.equals($scope.user.password,''))
    			)
    	$scope.signin();
    };
	
	$scope.signin = function () {
		
		$scope.form_disabled = true;
		
		var promise = DirectoryService.signin($scope.user.username, $scope.user.password);		
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
    		function(response) { 
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
    			$scope.alerts.push({type: 'success', msg: 'Signed in'});
    			$modalInstance.close();
    			var red = $('#signin').attr('data-redirect');
    			if(red){
    				window.location = red;
    			}else{
				window.location.reload();
    			}
    		}
    		,function(response) {
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
            	$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
            	$modalInstance.close();
            }
        );
		return;
		
		
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};

app.controller('FrontendCtrl', function($scope, $modal, $log, DirectoryService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner	
	$scope.loadingTracker = promiseTracker.register('loadingTrackerFrontend');
	
    $scope.alerts = [];        
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.signin_open = function () {

    	var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/partials/loginform.html',
            controller: ModalInstanceCtrl
    	});
    };
    
    $scope.init = function () {
    	if($('#signin').attr('data-open') == 1){
    		$scope.signin_open();
    	}
    };
      
});


