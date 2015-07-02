
angular.module('starter.services', [])

.factory('TakePhoto', function($cordovaCamera, $ionicPlatform){
	return function(fromCam, photo){

		$ionicPlatform.ready(function() {
  			var options = {
		      quality: 75,
		      destinationType: Camera.DestinationType.DATA_URL,
		      sourceType: fromCam,
		      allowEdit: true,
		      encodingType: Camera.EncodingType.JPEG,
		      targetWidth: 500,
		      targetHeight: 500,
		      popoverOptions: CameraPopoverOptions,
		      saveToPhotoAlbum: true
		    };
		  

	  		$cordovaCamera.getPicture(options).then(function(imageData) {
		      photo.src = "data:image/jpeg;base64," + imageData;
		      photo.date = new Date();
		    }, function(err) {
		      console.log(err);
		    });
		}); // End Platform Ready


	};
})

.factory('Local', function(APIPath, $http){
	return {
		StoreLogin : function(user) {
			var temp;
			if (!localStorage.KayApp) {
				localStorage.KayApp = '{}';
			}
			temp = JSON.parse(localStorage.KayApp);
			temp.User = user;
			temp.LoggedIn = true;
			temp.Authorized = false;
			localStorage.KayApp = JSON.stringify(temp);
		},
		UpdatePassword : function(pw) {
			var temp = JSON.parse(localStorage.KayApp);
			temp.User.password = pw;
			localStorage.KayApp = JSON.stringify(temp);
		},
		GetLogin : function() {
			if (localStorage.KayApp) {
				return JSON.parse(localStorage.KayApp);
			} else{
				return false;
			}
		},
		Login : function() {
			var temp = JSON.parse(localStorage.KayApp);
			temp.LoggedIn = true;
			localStorage.KayApp = JSON.stringify(temp);
		},
		UpdateUserStatus : function(val) {
			var temp = JSON.parse(localStorage.KayApp);
			temp.LoggedIn = val;
			temp.Authorized = true;
			localStorage.KayApp = JSON.stringify(temp);
		},
		StorePushDetails : function(udid) {
			var temp;
			if (!localStorage.KayAppUDID) {
				localStorage.KayAppUDID = '{}';
			}
			temp = JSON.parse(localStorage.KayAppUDID);
			temp.LoggedIn = false;
			temp.PushEnabled = {
				status : true,
				id : udid
			}
			localStorage.KayAppUDID = JSON.stringify(temp);
		},
		HasPushEnabled : function() {
			if (localStorage.KayAppUDID && JSON.parse(localStorage.KayAppUDID).PushEnabled) {
				return JSON.parse(localStorage.KayAppUDID).PushEnabled.status;
			} else {
				return false;
			}
		},
		StoreActivity : function(activity) {
			var temp;
			if (!localStorage.KayAppActivities) {
				localStorage.KayAppActivities = '[]';
			};
			temp = JSON.parse(localStorage.KayAppActivities);
			temp.push(activity);
			localStorage.KayAppActivities = JSON.stringify(temp);
		},
		GetActivities : function() {
			if (localStorage.KayAppActivities) {
				return JSON.parse(localStorage.KayAppActivities);
			};
		}
	};
})

.factory('API', function(APIPath, $http, Base64, Local, APIKey){
	return {
		CreateUser : function(user) {
            user.user = user.emailaddress;
            user.APIKEY = APIKey;
            return $http({
                method:'POST',
                url:APIPath+'users',
                data:user,
                headers : {'Content-Type': 'application/json'}
            });
		},
		Login : function(user) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(user.username + ':' + user.password);
			user.APIKEY = APIKey;
			return $http({
				method : 'POST',
				url : APIPath + 'users/login',
				data : user,
				headers : {'Content-Type' : 'Application/json'}
			});
		},
		GetProducts : function() {
			return $http.get(APIPath + 'products');
		},
		SendRequestEnquiry : function(data) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(Local.GetLogin().User.emailaddress + ':' + Local.GetLogin().User.password);
			data.region = JSON.parse(localStorage.KayApp).User.region;
			data.date = new Date().toDateString();
			data.contactNumber = Local.GetLogin().User.contactNumber;
			data.company = Local.GetLogin().User.company;
			data.relationshipType = Local.GetLogin().User.relationshipType;
			data.industry = Local.GetLogin().User.industry;
			Local.StoreActivity(data);
		    return $http(
		        {
		          method : 'POST',
		          url : APIPath + 'request',
		          data : data,
		          headers : {'Content-Type': 'application/json'}
		        });
		},
		CheckAuthorized : function() {
			return $http.post(APIPath + 'checkAuth?email='+Local.GetLogin().User.emailaddress);
		},
		StoreTokenForPush : function(token) {
			var payload = {
				token : token
			}
			return $http(
		        {
		          method : 'POST',
		          url : APIPath + 'storeToken',
		          data : payload,
		          headers : {'Content-Type': 'application/json'}
		        });
		},
        ResetPassword:function(data){
            data.APIKEY = APIKey;
            return $http({
                method:'POST',
                url:APIPath+'account/resetPassword',
                data:data,
                headers:{'Content-Type':'application/json'}            
            });
        },
        GetResetQuestion:function(username){
            var data={};         
			data.APIKEY = APIKey;
			data.username = username;
			return $http({
				method : 'POST',
				url : APIPath + 'account/getResetQuestion',
				data : data,
				headers : {'Content-Type' : 'application/json'}
			});           
        
        },
		UpdateUser : function(user) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(Local.GetLogin().User.emailaddress + ':' + Local.GetLogin().User.password);
			user.APIKEY = APIKey;
			user.username = Local.GetLogin().User.username;
			return $http({
				method : 'POST',
				url : APIPath + 'users/update',
				data : user,
				headers : {'Content-Type' : 'application/json'}
			});
		},
		ChangePassword : function(passwords) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(Local.GetLogin().User.emailaddress + ':' + Local.GetLogin().User.password);
			passwords.username = Local.GetLogin().User.username;
			passwords.APIKEY = APIKey;
			return $http({
				method : 'POST',
				url : APIPath + 'account/changePassword',
				data : passwords,
				headers : {'Content-Type' : 'application/json'}
			})
		}
	};
})

.factory('APIPath', function() {
	 // return 'http://localhost:5001/api/';
	return 'http://Kayappapi.kaymac.co.za/api/';
	// return 'http://kayappapi.azurewebsites.net/api/';
	// return 'http://10.1.50.20:5001/api/'
})

.factory('APIKey', function(){
	return '913we766wykg';
})

.factory('Regions', function(){
	return {
		Get : function() {
			return ['Northern Cape','Eastern Cape','Free State','Western Cape','Limpopo','North West','KwaZulu-Natal','Mpumalanga','Gauteng'];
		}
	}
})

.factory('Alert', function($ionicPopup){
	return function(title, message, callback){
		var alertPopup = $ionicPopup.alert({
		    title: title,
		    template: message
		  });
		  alertPopup.then(function(res) {
		    if (callback) {
		    	callback();
		    };
		  });
	};
})

.factory('Request', function(Local){
	return function (clear) {

		if (!clear) {
			var user = Local.GetLogin().User;
		};

		if (user) {
			return {
				firstName: user.firstName,
				lastName : user.lastName,
				emailaddress: user.emailaddress,
				company : user.company,
				contactNumber : user.contactNumber,
				address : user.address,
				region : user.region,
				type : '',
				prodquant : '',
				details : ''
			}
		} else {
			return {
				firstName : '',
				lastName : '',
				emailaddress: '',
				company : '',
				contactNumber : '',
				address : '',
				region : '',
				type : '',
				prodquant : '',
				details : ''
			}
		}

		
	};
})

.factory('Enquiry', function(Local){
	return function (clear) {

		if (!clear) {
			var user = Local.GetLogin().User;
		};

		if (user) {
			return {
				firstName: user.firstName,
				lastName : user.lastName,
				emailaddress: user.emailaddress,
				type : '',
				comments : ''
			}
		} else {
			return {
				firstName: '',
				lastName : '',
				emailaddress: '',
				type : '',
				comments : ''
			}
		}

		
	};
})

.factory('User', function(){
	return function () {
		return {
			username: '',
			password: '',
			fullname : '',
			emailaddress : '',
			company : '',
			contactNumber : '',
			address : [],
            postalAddress:[],
            sameAsPhysical:false,
			region : '',
            Question:'',
            Answer:''
		}
	};
})

.factory('Platform', function(){
	return {
		deviceInformation : ionic.Platform.device(),
		isWebView : ionic.Platform.isWebView(),
		isIPad : ionic.Platform.isIPad(),
		isIOS : ionic.Platform.isIOS(),
		isAndroid : ionic.Platform.isAndroid(),
		isWindowsPhone : ionic.Platform.isWindowsPhone(),
		currentPlatform : ionic.Platform.platform(),
		currentPlatformVersion : ionic.Platform.version(),
	};
})

.factory('GetOptions', function(){
	return function(scope){

		var temp = [];

		switch(scope.Type){
			case 'account':
				scope.Heading = 'Account Enquiry';
				temp = ['New Account Application', 'Credit Limit Increase', 'Invoice Request', 'Statement Request', 'Transaction Query'];
				break;
			case 'order':
				scope.Heading = 'Order Request/Quote'
				temp = [];
				break;
			case 'technical':
				scope.Heading = 'Technical Support'
				temp = ['Technical Question', 'Library Info', 'Data Sheets', 'Training – Intro to Geosynthetics', 'Training – Filtration and Drainage',
						'Training – Erosion Control', 'Training – Lining Systems with GCL', 'Training – Soil Reinforcement', 'Training – Road Pavement Maintenance',
						'Training - Formed In-Situ Dam Linings'];
				break;
			case 'design':
				scope.Heading = 'Design Request'
				temp = ['Drainage and Filtration', 'Retaining Walls', 'Soil Reinforcement and Separation', 'Road Pavement Optimization',
				'Haul Roads', 'Mine Waste Containment', 'Landfill Linings and Cappings', 'Dam Linings', 'Sludge Dewatering', 'Erosion Protection',
				'Coastal Erosion Protection'];
				break;
			default:
				scope.Heading = 'Enquiry'
				break;
		}

		return temp;
	};
})

.factory('Bidim', function(){
	return [
		{
			name : 'A1'
		},
		{
			name : 'A2'
		},
		{
			name : 'A3'
		},
		{
			name : 'A4'
		},
		{
			name : 'A5'
		}
	]
})

.factory('RelationshipTypes', function(){
	return function(){
		return [
			'Academic',
			'Accomodation',
			'Agent',
			'Architect',
			'Cash Sale Customer',
			'Competitor',
			'Consulting Engineer',
			'Contractor',
			'Customer',
			'Developer',
			'Distributor',
			'District Municipality',
			'Landscaper',
			'Local Municipality',
			'Manufacturer',
			'Merchant',
			'National Government',
			'Plumber',
			'Project Manager',
			'Provincial Government',
			'Quantity Surveyor',
			'Retailer',
			'Service Provider',
			'Supplier',
			'Transporter',
			'Waterproofer'
		]
	};
})

.factory('Industries', function(){
	return function(){
		return [
			'Advertising',
			'Agriculture',
			'Building',
			'Chemical',
			'Civil',
			'Coastal',
			'CRB & Paving',
			'Earthworks',
			'Electrical',
			'Environment',
			'Forestry',
			'Geotechnical',
			'Horticulture',
			'Housing',
			'Industrial',
			'Lining',
			'Marine',
			'Media',
			'Mining',
			'Ports',
			'Rail',
			'Retail',
			'Roads',
			'Sports Turf',
			'Structural',
			'Surfacing',
			'Waste',
			'Water',
			'Waterproofing'
		]
	};
})

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})

.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});























