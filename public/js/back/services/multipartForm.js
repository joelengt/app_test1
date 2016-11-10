myApp.service('multipartForm', ['$http', function($http){
	this.post = function(uploadUrl, data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		});
	}
}])
/*myApp.service('upload', ["$http", "$q", function ($http, $q) 
{
	this.uploadFile = function(file)
	{
		var deferred = $q.defer();
		var formData = new FormData();
		formData.append("file", file);
		return $http.post('uploads', formData, {
			headers: {
				"Content-type": undefined
			},
			transformRequest: angular.identity
		})
		.success(function(res)
		{
			deferred.resolve(res);
		})
		.error(function(msg, code)
		{
			deferred.reject(msg);
		})
		return deferred.promise;
	}	
}])*/