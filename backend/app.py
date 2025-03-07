from flask import Flask, request, jsonify
from flask_cors import CORS
from ml.budget_model import BudgetPlanner
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

budget_planner = BudgetPlanner()

# Route to add income and categories
@app.route('/api/add-income', methods=['POST'])
def add_income():
    try:
        data = request.json
        
        # Save income data to JSON file
        try:
            with open("data/incomeData.json", "r") as f:
                income_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            income_data = []

        # Update or add new income data
        new_income = {
            "email": data['email'],
            "income": data['income'],
            "categories": data['categories'],
            "date_added": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Update existing entry or add new one
        existing_entry = next((item for item in income_data if item["email"] == data['email']), None)
        if existing_entry:
            existing_entry.update(new_income)
        else:
            income_data.append(new_income)

        # Save updated data
        with open("data/incomeData.json", "w") as f:
            json.dump(income_data, f, indent=2)

        return jsonify({"message": "Income saved successfully"}), 200

    except Exception as e:
        print(f"Error in add_income: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to generate AI budget
@app.route('/api/generate-budget', methods=['POST'])
def generate_budget():
    try:
        data = request.json
        budget_plan = budget_planner.generate_budget(
            email=data['email'],
            income=data['income'],
            categories=data['categories']
        )

        # Save generated budget plan
        try:
            with open("data/budgetPlans.json", "r") as f:
                budget_plans = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            budget_plans = []

        # Update existing plan or add new one
        existing_plan = next((plan for plan in budget_plans if plan["email"] == data['email']), None)
        if existing_plan:
            existing_plan.update(budget_plan)
        else:
            budget_plans.append(budget_plan)

        # Save updated plans
        with open("data/budgetPlans.json", "w") as f:
            json.dump(budget_plans, f, indent=2)

        return jsonify(budget_plan), 200

    except Exception as e:
        print(f"Error in generate_budget: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to save adjusted budget
@app.route('/api/save-budget', methods=['POST'])
def save_budget():
    try:
        data = request.json
        
        # Load existing budget plans
        try:
            with open("data/budgetPlans.json", "r") as f:
                budget_plans = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            budget_plans = []

        # Update existing plan or add new one
        existing_plan = next((plan for plan in budget_plans if plan["email"] == data['email']), None)
        if existing_plan:
            existing_plan.update(data)
        else:
            budget_plans.append(data)

        # Save updated plans
        with open("data/budgetPlans.json", "w") as f:
            json.dump(budget_plans, f, indent=2)

        return jsonify({"message": "Budget plan saved successfully"}), 200

    except Exception as e:
        print(f"Error in save_budget: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to get user's budget plan
@app.route('/api/get-budget/<email>', methods=['GET'])
def get_budget(email):
    try:
        with open("data/budgetPlans.json", "r") as f:
            budget_plans = json.load(f)
            
        user_plan = next((plan for plan in budget_plans if plan["email"] == email), None)
        
        if user_plan:
            return jsonify(user_plan), 200
        else:
            return jsonify({"error": "No budget plan found"}), 404

    except Exception as e:
        print(f"Error in get_budget: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200

if __name__ == '__main__':
    # Ensure data directory exists
    import os
    if not os.path.exists("data"):
        os.makedirs("data")
        
    # Create empty JSON files if they don't exist
    for filename in ["incomeData.json", "budgetPlans.json"]:
        filepath = f"data/{filename}"
        if not os.path.exists(filepath):
            with open(filepath, "w") as f:
                json.dump([], f)

    app.run(debug=True, port=5000) 