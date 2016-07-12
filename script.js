var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
        access_token: "4226502.b8da7b5.b5a656bae610496986a35cb93612a295"
	    }
	  }).then(function(response) {
      $scope.picArray = response.data.data;
      console.log(response);
      // now analyze the sentiments and do some other analysis
      // on your images 
      var egoCount = 0;
      var numberLikes = 0;
      var captionCount = 0;
      var hashtags = 0;

      for(i=0; i<$scope.picArray.length; i++) {
      	if($scope.picArray[i].user_has_liked) {
      		egoCount ++;
      	}
        $scope.egoScore = egoCount;
      	numberLikes += $scope.picArray[i].likes.count;
        $scope.averageLikes = numberLikes / $scope.picArray.length;
        hashtags += $scope.picArray[i].tags.length;
        $scope.avgHashtagLength = hashtags / $scope.picArray.length;

        if ($scope.picArray[i].caption === null) {
          captionCount += 0;
        }
        else {
          captionCount += $scope.picArray[i].caption.text.length; 
        }
        
        $scope.avgCaptionLength = captionCount / $scope.picArray.length;

    }

        var day = "";
        var activeDays = [];

        for (var i=0; i<$scope.picArray.length; i++) {
          day = $scope.picArray[i].created_time; 
          var date = new Date(day * 1000);
          var newDate = date.getDay()
          activeDays.push(newDate);
        }

        var sun = 0; 
        var mon = 0;
        var tues = 0; 
        var wed = 0; 
        var thurs = 0; 
        var fri = 0; 
        var sat = 0;

        for(var i=0; i<activeDays.length; i++) {
          if (activeDays[i]===0) {
            sun++;
          }
          else if(activeDays[i]===1) {
            mon++;
          }
          else if(activeDays[i]===2) {
            tues++; 
          }
          else if(activeDays[i]===3) {
            wed++; 
          }
          else if(activeDays[i]===4) {
            thurs++;
          }
          else if(activeDays[i]===5) {
            fri++;  
          }
          else if(activeDays[i]===6) {
            sat++; 
          }
        }
        var dayOfWeek = [];
        dayOfWeek.push(sun, mon, tues, wed, thurs, fri, sat);

        var maxDay=0; 
        for(var i=0; i<dayOfWeek.length; i++) {
          if (dayOfWeek[i]>maxDay) {
            maxDay = dayOfWeek[i] 
          }
        }

        var dayActive = "";
        if (maxDay === sun) {
          dayActive = "Sunday";
        }
        if (maxDay === mon) {
          dayActive = "Monday";
        }
        if (maxDay === tues) {
          dayActive = "Tuesday";
        }
        if (maxDay === wed) {
          dayActive = "Wednesday";
        }
        if (maxDay === thurs) {
          dayActive = "Thursday";
        }
        if (maxDay === fri) {
          dayActive = "Friday";
        }
        if (maxDay === sat) {
          dayActive = "Saturday";
        }
        console.log(dayActive);

        $scope.activeDay = dayActive; 
	  

    var captions = 0; 
    var captionsNull = 0;
    for (var i = 0; i < $scope.picArray.length; i++) {
      if($scope.picArray[i].caption === null) {
        captionsNull = 0;
      }
      else {
      captions = $scope.picArray[i].caption.text;
      analyzeSentiments(captions); 
      }
    }
      
    $scope.positivityArray = [];

    })
};

	var analyzeSentiments = function(i) {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are

    $http ({
        url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/",
        method: 'GET',
        headers: {
          'X-Mashape-Key': '9dpVK5tiLcmsh1CCtAKytACwFcv7p1hvAPgjsnPnNQZcpsa2Go',
        },
        params: {
          text: i
        }

    }).then(function(response) {
        console.log(response);
        $scope.positivityArray.push(response.data.score);
        console.log('test');
        var totalPositivity = 0; 
        for (var i=0; i< $scope.positivityArray.length; i++) {
          totalPositivity += $scope.positivityArray[i];
          console.log("positivity array yay!");
        }

        $scope.avgPositivity = totalPositivity / $scope.positivityArray.length;

    });
    
	}


});