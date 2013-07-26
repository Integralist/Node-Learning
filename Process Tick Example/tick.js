/*
    The `process` global object has a method called `nextTick`. 
    This method basically says, "Give up control of execution, 
    and then when you have a free moment, call the provided function."
    It tends to be significantly faster than just using the setTimeout function.
 */

var a1 = [ 3476, 2457, 7547, 34523, 3, 6, 7,2, 77, 8, 2345,
           7623457, 2347, 23572457, 237457, 234869, 237,
           24572457524] ;
var a2 = [ 3476, 75347547, 2457634563, 56763472, 34574, 2347,
           7, 34652364 , 13461346, 572346, 23723457234, 237,
           234, 24352345, 537, 2345235, 2345675, 34534,
           7582768, 284835, 8553577, 2577257,545634, 457247247,
           2345 ];

function computeIntersection (arr1, arr2, callback) {
    var biggerArray  = arr1.length > arr2.length ? arr1 : arr2,
        smallerArray = biggerArray == arr1 ? arr2 : arr1,
        bigLength    = biggerArray.length,
        smallLength  = smallerArray.length,
        startIndex   = 0,
        size         = 10,
        results      = [];

    function subComputeIntersection(){
        var i = startIndex,
            limit_one = startIndex + size,
            limit_two = bigLength;

        while (i < limit_one && i < limit_two) {
            var j = 0;

            while (j < smallLength) {
                if (biggerArray[i] == smallerArray[j]) {
                    results.push(smallerArray[j]);
                    break;
                }

                j++;
            }

            i++;
        }

        if (i >= bigLength) {
            callback(null, results);
        } else {
            startIndex += size;
            process.nextTick(subComputeIntersection);
        }
    }

    subComputeIntersection();

    /*
        To help aid the performance of this computational task we 
        break the bigger of the two Arrays into chunks of 10.

        We then compute the intersection of the first chunk, and
        then use `process.nextTick` to allow other events or requests 
        that have been added to the event queue in the mean time 
        to do their work.

        Passing `subComputeIntersection` to `nextTick` ensures that 
        the current scope is preserved as a closure so you can store 
        the intermediate results in the variables declared in 
        `computeIntersection`.
     */
}

computeIntersection(a1, a2, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
});