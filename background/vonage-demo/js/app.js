// replace these values with those generated in your TokBox Account
var apiKey = "YOUR_API_KEY";
var sessionId = "YOUR_SESSION_ID";
var token = "YOUR_TOKEN";

const BackgroundFilter = vectorly.BackgroundFilter;
// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}
async function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream

    // Create a publisher
    const config = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }


    try{
        const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        const filter = new BackgroundFilter(stream, 
            {
                token: 'your-vectorly-token',
                model: 'webgl' || 'selfie', // switch between models as per client's device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
                background: 'blur',
                debug: false,
                analyticsEnabled: false,
                passthrough: true,
                frameRate: 30,
                segmentationFrameRate: 15
            }
        );

        config.videoSource = await filter.getOutputTrack();

    } catch (e) {
        console.warn("There was an error loading the virtual background");
        console.warn(e);
    }



    var publisher = OT.initPublisher('publisher', config, handleError);



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

    });
}


