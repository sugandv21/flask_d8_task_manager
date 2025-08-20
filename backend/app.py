from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",  
    "https://taskmanagerd8.netlify.app" 
]}})

tasks = [
    {"id": 1, "title": "Learn Flask"},
    {"id": 2, "title": "Build Task Manager"},
]

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Task title is required"}), 400
    
    new_task = {
        "id": len(tasks) + 1,
        "title": data["title"]
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
    app.run(debug=False)


