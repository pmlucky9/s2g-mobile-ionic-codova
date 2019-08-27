angular.module('app.s2gServices')
.factory('Photo', ['$q', '$rootScope', '$steroids', '$window', '$ionicActionSheet', 'S2gApi', 'UserService',  function($q, $rootScope, $steroids, $window, $ionicActionSheet, S2gApi, UserService) {
	var getPicture = function(source){
		//if new picture we save it to the library if from gallery then dont resave
		var saveToLibrary = (source == 1);//source = 0:gallery, source=1:camera
		console.log(saveToLibrary);
		var q = $q.defer();
		var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,   
      sourceType: source,
      correctOrientation: true,
      targetHeight: 400,
      targetWidth: 400, // targetHeight and targetWidth have to be used in pair
      saveToPhotoAlbum: saveToLibrary
		}
		navigator.camera.getPicture(function(result) {
			q.resolve(result);
		}, function(err) {
			console.log("getPic Error", err);
			q.reject(err);
		}, options);
			return q.promise;
	}
	var formatPictureUrl = function(imageURI){
		//so that we can display the image from the device
		var q = $q.defer();
			var imageFile = {};
			this.imageObject.deviceImageURI = imageURI;//this is what we use to save the file
			var fileErrorHandler = function (error) { q.reject(error); };
			//resolve the file url so we can display it immediately
			$steroids.on('ready', function() {
				var targetDirURI = 'file://' + $steroids.app.absoluteUserFilesPath;
				$window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
					$window.resolveLocalFileSystemURL(targetDirURI, function(directory) {
						fileEntry.copyTo(directory, null, function(file) {
							imageObject.imageURL = '/' + file.name + '?' + ((new Date()).getTime());
              console.log("service format", imageObject);
              q.resolve(imageObject);
						}, fileErrorHandler)
					}, fileErrorHandler)
				}, fileErrorHandler)
			});
			console.log(q.promise);
			return q.promise;
	}
	//save picture to server and return url
	var savePicture = function(){
		var q = $q.defer();
			var img = new Image();
			img.onload = function() {
				imageObject.width = this.width;
				imageObject.height = this.height;
				console.log("saving", imageObject);
				S2gApi.saveItemImage(imageObject, UserService.token)
	        .then(function (image) {
	        	console.log("saved", image);
	        	q.resolve(image);
	        }, function (error) {
	        q.reject(error);
	        console.log(error);
	      });
	      }
      img.src = imageObject.imageURL;
      return q.promise;
	}
	var imageObject = {
		height:null,
		width:null,
		imageURL:null,
		deviceImageURI:null
	}
	var alert = function(source){
		console.log("im clicked", source);
	}
	return {
		getPicture: getPicture,		
		formatPictureUrl: formatPictureUrl,
		savePicture: savePicture,
		imageObject: imageObject,
		alert: alert
	}
}]);