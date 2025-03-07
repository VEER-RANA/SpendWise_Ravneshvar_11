import sys
import json
import numpy as np
from datetime import datetime
import traceback

class BudgetPlanner:
    def __init__(self):
        self.default_ratios = {
            "Housing": 0.30,
            "Food": 0.15,
            "Transport": 0.10,
            "Utilities": 0.10,
            "Healthcare": 0.10,
            "Entertainment": 0.05,
            "Shopping": 0.05,
            "Education": 0.05,
            "Savings": 0.05,
            "Investments": 0.05
        }
    
    def analyze_transactions(self, transactions):
        try:
            category_expenses = {}
            
            if not transactions:
                return {}
                
            # Calculate average spending per category
            for transaction in transactions:
                category = transaction.get("category", "Other")
                amount = float(transaction.get("amount", 0))
                
                if category not in category_expenses:
                    category_expenses[category] = []
                category_expenses[category].append(amount)
            
            # Calculate average ratios
            total_spent = sum(sum(amounts) for amounts in category_expenses.values())
            category_ratios = {}
            
            for category, amounts in category_expenses.items():
                avg_amount = sum(amounts) / len(amounts)
                ratio = avg_amount / total_spent if total_spent > 0 else 0
                category_ratios[category] = ratio
                
            return category_ratios
        except Exception as e:
            print(json.dumps({"error": f"Error in analyze_transactions: {str(e)}"}), file=sys.stderr)
            return {}

    def generate_budget(self, income, categories, transactions):
        try:
            # Analyze past transactions
            historical_ratios = self.analyze_transactions(transactions)
            
            # Initialize budget allocation
            category_budget = {}
            remaining_income = float(income)
            
            # First pass: Allocate based on historical data and default ratios
            for category in categories:
                if category in historical_ratios:
                    # Use historical ratio with some adjustment towards ideal ratio
                    ideal_ratio = self.default_ratios.get(category, 1/len(categories))
                    ratio = (historical_ratios[category] * 0.7) + (ideal_ratio * 0.3)
                else:
                    # Use default ratio or equal distribution
                    ratio = self.default_ratios.get(category, 1/len(categories))
                
                amount = round(income * ratio)
                category_budget[category] = amount
                remaining_income -= amount
            
            # Second pass: Adjust for remaining income
            if remaining_income != 0:
                adjustment = remaining_income / len(categories)
                for category in categories:
                    category_budget[category] = round(category_budget[category] + adjustment)
            
            # Calculate recommended savings (minimum 20% of income)
            recommended_savings = max(round(income * 0.2), 
                                   income - sum(category_budget.values()))
            
            # Generate personalized tips
            tips = self.generate_tips(income, category_budget, historical_ratios)
            
            return {
                "category_budget": category_budget,
                "recommended_savings": recommended_savings,
                "budget_tips": tips
            }
        except Exception as e:
            print(json.dumps({"error": f"Error in generate_budget: {str(e)}"}), file=sys.stderr)
            return None

    def generate_tips(self, income, budget, historical_ratios):
        try:
            tips = []
            
            # Basic tips
            tips.append(f"Aim to save at least ₹{round(income * 0.2):,} (20% of your income)")
            
            # Category-specific tips
            high_spending_categories = []
            for category, amount in budget.items():
                if category in historical_ratios:
                    historical_amount = income * historical_ratios[category]
                    if amount < historical_amount * 0.8:
                        tips.append(f"Consider reducing {category} expenses by ₹{round(historical_amount - amount):,}")
                        high_spending_categories.append(category)
            
            if high_spending_categories:
                tips.append(f"Focus on reducing expenses in: {', '.join(high_spending_categories)}")
            
            tips.append("Track your expenses regularly to stay within budget")
            tips.append("Build an emergency fund worth 3-6 months of expenses")
            
            return tips
        except Exception as e:
            print(json.dumps({"error": f"Error in generate_tips: {str(e)}"}), file=sys.stderr)
            return ["Track your expenses regularly", "Try to save at least 20% of your income"]

def main():
    try:
        if len(sys.argv) < 5:
            print(json.dumps({"error": "Missing arguments. Required: email, income, categories, transactions"}))
            sys.exit(1)
        
        email = sys.argv[1]
        income = float(sys.argv[2])
        categories = json.loads(sys.argv[3])
        transactions = json.loads(sys.argv[4])
        
        planner = BudgetPlanner()
        budget_plan = planner.generate_budget(income, categories, transactions)
        
        if budget_plan:
            print(json.dumps(budget_plan))
            sys.exit(0)
        else:
            print(json.dumps({"error": "Failed to generate budget plan"}))
            sys.exit(1)
    except Exception as e:
        error_msg = f"Error: {str(e)}\nTraceback: {traceback.format_exc()}"
        print(json.dumps({"error": error_msg}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
