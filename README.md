# Smart Navigation System for Blind People

## 📌 Project Overview

The **Smart Navigation System for Blind People** is a web-based navigation assistance system designed to help visually impaired users with location, destination search, voice assistance, route information, and AI-based obstacle detection.

The system combines **GPS, voice interaction, digital maps, route calculation, and AI object detection** to provide an accessible navigation experience.

## 🎯 Objective

The main objective of this project is to develop a smart navigation prototype that can assist blind users by providing:

* Current location detection
* Voice-based destination input
* Route calculation
* Distance and estimated travel time
* Voice feedback
* AI-based object detection
* Left, center, and right obstacle position detection

## ✨ Features

### 📍 Current Location

Uses the device's GPS/geolocation feature to detect the user's current location.

### 🎤 Voice Destination Search

Users can speak the destination instead of typing it.

### 🗺️ Interactive Map

Displays the current location, destination, and calculated route using an interactive map.

### 🧭 Route Navigation

Calculates a route between the user's current location and the selected destination.

### 📏 Distance and Time

Displays the estimated route distance and travel time.

### 🔊 Voice Assistance

Provides important information through speech, including location, destination, route, and obstacle alerts.

### 📷 Camera Access

Uses the device camera for visual environment analysis.

### 🤖 AI Obstacle Detection

Uses TensorFlow.js and the COCO-SSD model to detect objects through the camera.

### ↔️ Obstacle Position Detection

Identifies whether a detected object is approximately:

* Left
* Center
* Right

and provides a voice alert.

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript
* Leaflet.js
* TensorFlow.js
* COCO-SSD

### Backend

* Python
* Flask
* Flask-CORS

### APIs / Services

* OpenStreetMap
* Nominatim
* OSRM Routing API
* Browser Geolocation API
* Web Speech API
* Browser Camera API

## 📂 Project Structure

```text
Smart_Navigation_System_for_Disabled/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── backend/
    ├── app.py
    └── requirements.txt
```

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/shainiguduru239-star/Smart_Navigation_System_for_Disabled.git
```

### 2. Open the project in VS Code

Open the downloaded project folder in Visual Studio Code.

### 3. Install backend dependencies

Open the terminal inside the `backend` folder and run:

```bash
pip install -r requirements.txt
```

### 4. Start the Flask backend

```bash
python app.py
```

### 5. Start the frontend

Open the `frontend/index.html` file using **VS Code Live Server**.

### 6. Allow permissions

Allow the browser to access:

* Location
* Microphone
* Camera

## ⚠️ Limitations

This project is a **college-level prototype**. AI object detection may sometimes miss or incorrectly identify objects. GPS accuracy can also vary depending on the device and environment.

Therefore, the system should not be considered a safety-certified navigation system or a replacement for established mobility aids or human assistance.

## 🚀 Future Scope

Future versions can include:

* Turn-by-turn voice navigation
* Better obstacle detection
* Real-time obstacle distance estimation
* Emergency SOS functionality
* Nearby hospitals and emergency services
* Offline navigation
* More advanced AI models
* Wearable device integration
* Improved accessibility features

## 👩‍💻 Project

**Smart Navigation System for Blind People**

Developed as an academic project to explore accessible navigation using web technologies, GPS, voice interaction, and artificial intelligence.
