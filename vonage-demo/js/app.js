// replace these values with those generated in your TokBox Account
var apiKey = "YOUR_API_KEY";
var sessionId = "YOUR_SESSION_ID";
var token = "YOUR_TOKEN";


// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}
function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);


    // Connect to the session
    session.connect(token, function(error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });


    session.on('streamCreated', function(event) {

        const subscriber = session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, handleError);

        subscriber.on('videoElementCreated', function (){
            const video = subscriber.element.querySelector('video');
            const upscaler  = new vectorlyUpscaler(video, {token: '..your-token....'});

            upscaler.on('load', function (){
               console.log("Upscaler was initialized successfully!") ;
            });

            upscaler.on('error', function (){
               console.log("There was an issue initializing the upscaler");
            });
        });

    });
}


