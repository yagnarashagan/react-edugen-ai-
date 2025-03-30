from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

app.config["JWT_SECRET_KEY"] = "d9998be18a5790df9331d42882fe7ba323c29eb944e7cde4db8033f20b762a9f"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["edugen_ai"]
users = db["users"]  # Common collection for students & staff

# Register Route
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if users.find_one({"email": data["email"]}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user_data = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password,
        "role": data["role"]
    }

    users.insert_one(user_data)
    return jsonify({"message": "Registration successful!"}), 201

# Login Route
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})

    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        access_token = create_access_token(identity={"email": user["email"], "role": user["role"]})
        return jsonify({"token": access_token, "message": "Login successful"}), 200

    return jsonify({"message": "Invalid email or password"}), 401

if __name__ == "__main__":
    app.run(debug=True)
