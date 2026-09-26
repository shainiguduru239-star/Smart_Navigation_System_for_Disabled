from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Smart Navigation System Backend is running"
    })


@app.route("/api/navigation", methods=["POST"])
def navigation():

    data = request.get_json()

    start = data.get("start")
    destination = data.get("destination")
    mode = data.get("mode", "driving")

    if not start or not destination:
        return jsonify({
            "error": "Start location and destination are required"
        }), 400

    return jsonify({
        "message": "Navigation request received",
        "start": start,
        "destination": destination,
        "travel_mode": mode
    })


if __name__ == "__main__":
    app.run(debug=True)