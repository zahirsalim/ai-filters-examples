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
        const filter = new BackgroundFilter(stream, {token: '<your-token>', background: 'https://demo.vectorly.io/virtual-backgrounds/1.jpg'});
        const filteredStream = await filter.getOutput();

        config.videoSource = filteredStream.getVideoTracks()[0];

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


