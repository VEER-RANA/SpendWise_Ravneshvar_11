import json
from flask import Flask, request, jsonify

app = Flask(__name__)

BUDGET_FILE = "../data/budgetPlans.json"

def read_json(file_path):
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_json(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=2)

@app.route("/generate-budget", methods=["POST"])
def generate_budget():
    data = request.json
    email = data.get("email")
    income = data.get("income")
    categories = data.get("categories")

    if not email or not income or not categories:
        return jsonify({"error": "Missing required fields"}), 400

    # ✅ Dummy AI-based budget allocation (Replace this with ML model logic)
    budget_allocation = {category: round(0.3 * income / len(categories)) for category in categories}
    saving_plan = {"Emergency Fund": round(0.1 * income), "Investments": round(0.2 * income)}

    # ✅ Save to budgetPlans.json
    budget_data = read_json(BUDGET_FILE)
    user_budget = {"email": email, "budgetPlan": budget_allocation, "savingPlan": saving_plan, "date": "2025-03-06T10:30:00Z"}

    existing_index = next((i for i, entry in enumerate(budget_data) if entry["email"] == email), -1)
    if existing_index != -1:
        budget_data[existing_index] = user_budget
    else:
        budget_data.append(user_budget)

    write_json(BUDGET_FILE, budget_data)

    return jsonify(user_budget)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
