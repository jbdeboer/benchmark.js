function Report($scope) {
	$scope.samples = times;
	$scope.y = 10;
	$scope.x = 10;
	$scope.w = 10;

	var startTime = times[0].start;
	var endTime = times[times.length-1].end;

	var maxTime = times[0].end - times[0].start;
	var minTime = times[0].end - times[0].start;
	for (var i = times.length - 1; i >= 0; i--) {
		var x = times[i].end - times[i].start;
		if (x > maxTime) maxTime = x;
		if (x < minTime) minTime = x;
	};

   

    $scope.startTime = startTime;
    $scope.maxTime = maxTime;
    $scope.minTime = minTime;


    var width = 500;
    var scaling = 500 / (endTime - startTime);
	var segs = [];
	for (var i = 0; i < times.length; i++) {
		var t = times[i];
		var e = t.end - t.start;
		segs.push({x: (t.start - startTime) * scaling,
		           y: maxTime - e,
		           w: e * scaling});
	};

	$scope.segs = segs;

	$scope.avg = times[3].end - times[3].start;
}