let map;
let currentLocation = null;
let currentMarker = null;
let routeLine = null;
let destinationMarker = null;

map = L.map("map").setView([17.3850, 78.4867], 12);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}


function getCurrentLocation() {

    if (!navigator.geolocation) {
        document.getElementById("status").innerText =
            "Geolocation is not supported.";

        speak("Location access is not supported on this device.");
        return;
    }

    document.getElementById("status").innerText =
        "Getting your current location...";

    speak("Getting your current location.");

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            currentLocation = [latitude, longitude];

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            currentMarker = L.marker(currentLocation)
                .addTo(map)
                .bindPopup("You are here")
                .openPopup();

            map.setView(currentLocation, 16);

            document.getElementById("status").innerText =
                "Your current location was detected.";

            speak("Your current location was detected.");

        },

        function(error) {

            console.log(error);

            document.getElementById("status").innerText =
                "Location access failed.";

            speak("Unable to access your location.");

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


function startVoiceSearch() {

    if (!("webkitSpeechRecognition" in window)) {
        alert("Voice search is not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    document.getElementById("status").innerText =
        "Listening... Please say your destination.";

    speak("Please say your destination.");

    setTimeout(() => {
        recognition.start();
    }, 1200);

    recognition.onresult = function(event) {

        const destination =
            event.results[0][0].transcript.trim();

        document.getElementById("destination").value =
            destination;

        document.getElementById("status").innerText =
            "Destination: " + destination;

        speak("Destination selected: " + destination);
    };

    recognition.onerror = function(event) {

        console.log("Speech recognition error:", event.error);

        document.getElementById("status").innerText =
            "Could not understand. Please try again.";

        speak("Sorry, I could not understand. Please try again.");
    };

    recognition.onend = function() {

        console.log("Voice search ended.");
    };
}

async function findRoute() {

    const destination =
        document.getElementById("destination").value;

    const travelMode =
        document.getElementById("travelMode").value;

    if (!currentLocation) {

        document.getElementById("status").innerText =
            "Please use your current location first.";

        speak("Please use your current location first.");

        return;
    }

    if (destination.trim() === "") {

        document.getElementById("status").innerText =
            "Please enter a destination.";

        speak("Please enter a destination.");

        return;
    }

    document.getElementById("status").innerText =
        "Searching for destination...";

    speak("Searching for your destination.");

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
        );

        const data = await response.json();

        if (data.length === 0) {

            document.getElementById("status").innerText =
                "Destination not found.";

            speak("Sorry, destination not found.");

            return;
        }

        const destinationLat =
            parseFloat(data[0].lat);

        const destinationLon =
            parseFloat(data[0].lon);

        const startLat = currentLocation[0];
        const startLon = currentLocation[1];

        const routeResponse = await fetch(
            `https://router.project-osrm.org/route/v1/${travelMode}/${startLon},${startLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`
        );

        const routeData = await routeResponse.json();

        if (routeData.code !== "Ok") {

            document.getElementById("status").innerText =
                "Unable to calculate route.";

            speak("Unable to calculate the route.");

            return;
        }

        const route = routeData.routes[0];

        const distance =
            (route.distance / 1000).toFixed(2);

        const duration =
            Math.round(route.duration / 60);

        document.getElementById("distance").innerText =
            distance + " km";

        document.getElementById("duration").innerText =
            duration + " minutes";

        document.getElementById("status").innerText =
            "Route found successfully.";

        if (routeLine) {
            map.removeLayer(routeLine);
        }

        if (destinationMarker) {
            map.removeLayer(destinationMarker);
        }

        routeLine = L.geoJSON(
            route.geometry
        ).addTo(map);

        destinationMarker = L.marker(
            [destinationLat, destinationLon]
        )
        .addTo(map)
        .bindPopup(destination)
        .openPopup();

        map.fitBounds(routeLine.getBounds());

        speak(
            "Route found. The distance is " +
            distance +
            " kilometers. Estimated travel time is " +
            duration +
            " minutes."
        );

    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "Something went wrong.";

        speak("Something went wrong while finding the route.");
    }
}
let cameraStream = null;
let detectionModel = null;
let detectionRunning = false;
let lastSpokenObject = "";
let lastSpokenTime = 0;

async function startCamera() {

    try {

        const video = document.getElementById("camera");

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        video.srcObject = cameraStream;
        video.style.display = "block";

        document.getElementById("detectionStatus").innerText =
            "Loading AI detection model...";

        speak("Camera started. Loading artificial intelligence model.");

        detectionModel = await cocoSsd.load();

        detectionRunning = true;

        document.getElementById("detectionStatus").innerText =
            "AI obstacle detection is active.";

        speak("AI obstacle detection is now active.");

        detectObjects();

    } catch (error) {

        console.error(error);

        document.getElementById("detectionStatus").innerText =
            "Unable to start AI detection.";

        speak("Unable to start obstacle detection.");
    }
}

function stopCamera() {
    detectionRunning=false;

    if (cameraStream) {

        cameraStream.getTracks().forEach(
            track => track.stop()
        );

        cameraStream = null;
    }

    const video = document.getElementById("camera");

    video.srcObject = null;
    video.style.display = "none";

    document.getElementById("detectionStatus").innerText =
        "Camera stopped.";

    speak("Camera stopped.");
}
async function detectObjects() {

    if (!detectionRunning || !detectionModel) {
        return;
    }

    const video = document.getElementById("camera");

    try {

        const predictions =
            await detectionModel.detect(video);

        if (predictions.length > 0) {

            const detectedObject =
                predictions[0].class;
            const box = predictions[0].bbox;

const objectCenterX =
    box[0] + box[2] / 2;

const videoWidth =
    video.videoWidth;

let position;

if (objectCenterX < videoWidth / 3) {
    position = "on your left";
} else if (objectCenterX < (videoWidth * 2) / 3) {
    position = "ahead";
} else {
    position = "on your right";
}

            const confidence =
                Math.round(predictions[0].score * 100);

            document.getElementById("detectionStatus").innerText =
                detectedObject +
                " detected (" +
                confidence +
                "% confidence)";

            const importantObjects = [
                "person",
                "car",
                "bicycle",
                "motorcycle",
                "bus",
                "truck"
            ];

            if (importantObjects.includes(detectedObject)) {

                const currentTime = Date.now();

                if (
                    detectedObject !== lastSpokenObject ||
                    currentTime - lastSpokenTime > 5000
                ) {

                    speak(
    detectedObject +
    " detected " +
    position +
    "."
);

                    lastSpokenObject =
                        detectedObject;

                    lastSpokenTime =
                        currentTime;
                }
            }
        }

    } catch (error) {

        console.error(error);
    }

    setTimeout(detectObjects, 1000);
}