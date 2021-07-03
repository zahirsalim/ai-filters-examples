/*

*/





onmessage = function(e) {


    function step (){

        setTimeout(step, 100);

        postMessage(0);

    }

    step();

}
