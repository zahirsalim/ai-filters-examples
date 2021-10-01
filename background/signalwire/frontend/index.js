"use strict";
const $ = (x) => document.getElementById(x);

const backendurl = "";

let room;

var urlParams = new URL(location.href).searchParams;

// Simple js to control when forms appear
function gotopage(pagename) {
    if (pagename === "getusername") {
        $("getusername").style.display = "block";
        $("videoroom").style.display = "none";
        $("loading").style.display = "none";
    } else if (pagename === "videoroom") {
        $("getusername").style.display = "none";
        $("videoroom").style.display = "block";
        $("loading").style.display = "none";
    } else {
        $("getusername").style.display = "none";
        $("videoroom").style.display = "none";
        $("loading").style.display = "block";
    }
}

async function joinwithusername() {
    let username = $("usernameinput").value.trim();
    console.log("The user picked username", username);
    gotopage("loading");

    try {
        let token = await axios.post(backendurl + "/get_token", {
            user_name: username
        });
        console.log(token.data);
        token = token.data.token;

        try {
            console.log("Setting up RTC session");


            navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;

            navigator.mediaDevices.getUserMedia = async function (params){

                const originalStream = await navigator.mediaDevices._getUserMedia(params);

                try{

                    const originalVideoTrack  = originalStream.getVideoTracks()[0];
                    const originalAudioTrack = originalStream.getAudioTracks()[0];
                    const filter = new vectorly.BackgroundFilter(originalVideoTrack, 
                        {
                            token: urlParams.get("vectorlyToken"),
                            background: 'blur',
                            model: 'webgl' || 'selfie', // switch between models as per client device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
                            debug: false,
                            analyticsEnabled: false,
                            passthrough: true,
                            frameRate: 30,
                            segmentationFrameRate: 15
                        }
                    )
                    const filteredVideoTrack = await filter.getOutputTrack();

                    return  new MediaStream([filteredVideoTrack, originalAudioTrack]);

                } catch (e) {
                    console.log("An error occurred while trying to load the background filter");
                    return originalStream;
                }

            };


            room = await SignalWire.Video.joinRoom({
                token,
                rootElementId: "root",
            });


            room.on("room.joined", (e) => logevent("You joined the room"));
            room.on("member.joined", (e) =>
                logevent(e.member.name + " has joined the room")
            );
            room.on("member.left", (e) =>
                logevent(e.member.id + " has left the room")
            );
        } catch (error) {
            console.error("Something went wrong", error);
        }

        gotopage("videoroom");
    } catch (e) {
        console.log(e);
        alert("Error encountered. Please try again.");
        gotopage("getusername");
    }
}

async function hangup() {
    if (room) {
        await room.hangup();
        gotopage("getusername");
    }
}

function logevent(message) {
    $("events").innerHTML += "<br/>" + message;
}

//Start
gotopage("getusername");
