//


function getHz(bench) {
    return 1 / (bench.stats.mean + bench.stats.moe);
  }

function ops(sample) {
	return 1 / sample.sample;
	return sample.ops / ((sample.end - sample.start) / 1000);
}

var arr = [1, 5, 4, 2, 3];

function init() {
	window.console && console.log('init called');
}
 
function Report($scope) {
	var bs = [];

  var timeScaling;

	var suite = new Benchmark.Suite('Sorting', {
		onComplete: function() {
      var maxElasped = 0;

			for (var i = 0; i < suite.length; i++) {
        var b = suite[i];
        // calculate the overall max-time
        var startTime = b.sampleTimes[0].start;
        var endTime = b.sampleTimes[b.sampleTimes.length - 1].end;
        var elasped = endTime - startTime;
        if (elasped > maxElasped) maxElasped = elasped;
        console.log('elasped', i, elasped);
      }

      console.log('maxElasped', maxElasped);

      timeScaling = 500 / maxElasped;

      for (i = 0; i < suite.length; i++) {
        b = suite[i];
				var s = {};
				compute(s, b);
				bs.push(s);
			}

      $scope.isRunning = false;
			console.log('complete', arguments, suite); $scope.$apply();
			console.log('scope', $scope);
		}
    });


	suite.add('Normal', '\
		x.sort(function(a, b) {\n\
			return a - b;\n\
		});'
	)
	.add('Exit Early', '\
		x.sort(function(a, b) {\n\
			return a - b;\n\
		});\n\
		return;'
	)

	.add('Async', {
		'defer': true,
		'fn': '\
			setTimeout(function() {\n\
				deferred.resolve();\n\
			}, 10);'
	}); /*
	.add('Error', '\
		x.foo(); // unknown method'
	)
	.add('Comments', '\
		// comments at start\n\
		x.reverse().sort(function(a, b) {\n\
			return a - b;\n\
		});\n\
		// comments at end'
	); */

	Benchmark.prototype.setup = '\
		window.foo = 42;\n\
		var x = arr;';

	Benchmark.prototype.teardown = '\
		window.foo = 24;';

	$scope.runTests = function() {
		suite.run({ 'async': true });
    $scope.isRunning = true;
	}

	$scope.bs = bs;


	//$scope.b = ;
	function compute($scope, benchmark) {
		var times = benchmark.sampleTimes;

		$scope.b = benchmark;

		$scope.samples = benchmark.sampleTimes;
		$scope.y = 10;
		$scope.x = 10;
		$scope.w = 10;

		var startTime = times[0].start;
		var endTime = times[times.length-1].end;

		var maxTime = times[0].end - times[0].start;
		var minTime = times[0].end - times[0].start;

		var minOps = ops(times[0]);
		var maxOps = ops(times[0]);

		for (var i = times.length - 1; i >= 0; i--) {
			var x = times[i].end - times[i].start;
			if (x > maxTime) maxTime = x;
			if (x < minTime) minTime = x;

			var o = ops(times[i]);
			if (o > maxOps) maxOps = o;
			if (o < minOps) minOps = o; 
		};

		var opsScaling = 60 / (maxOps - minOps)
	   

	    $scope.startTime = startTime;
	    $scope.maxTime = maxTime;
	    $scope.minTime = minTime;

	    $scope.minOps = minOps * opsScaling;
	    $scope.maxOps = maxOps * opsScaling;

	    console.log('maxOps', maxOps);


	    var width = 500;
	    var scaling = timeScaling;
		var segs = [];
		var minSeg, maxSeg;
		for (var i = 0; i < times.length; i++) {
			var t = times[i];
			var e = t.end - t.start;
			var r = {x: (t.start - startTime) * scaling,
			           y: (maxOps - ops(t)) * opsScaling,
			           w: e * scaling,
			           sample: ops(t),
                 ops: t.ops,
                 time: e};
			segs.push(r);
			if (ops(t) == minOps) minSeq = r;
			if (ops(t) == maxOps) maxSeq = r;
		};

		console.log('minSeq', maxSeq);

		$scope.maxSeg= maxSeq;
		$scope.minSeg = minSeq;

		$scope.segs = segs;

	    $scope.avgValue = getHz(benchmark);
		$scope.avg = getHz(benchmark) * opsScaling;
		console.log('avg:', getHz(benchmark));
		console.log('max:', maxOps);
		console.log('min:', minOps);
    }
}
