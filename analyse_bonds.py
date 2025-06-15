import json
import os
import xlwings as xw

# Define file paths
json_isin_path = os.path.join(os.path.dirname(__file__), "Portfolio", "isin.json")
json_gilts_path = os.path.join(os.path.dirname(__file__), "temp", "gilts.json")
excel_file = os.path.join(os.path.dirname(__file__), "obligation.xlsm")

# Load ISINs from the JSON file
with open(json_isin_path, 'r') as f:
    isin_data = json.load(f)
    selected_isins = isin_data["isins"]

# Load gilts data from gilts.json
with open(json_gilts_path, 'r') as f:
    gilts_data = json.load(f)

# Filter gilts data for selected ISINs
selected_gilts = [gilt for gilt in gilts_data if gilt["isin"] in selected_isins]

# Aggregate data for a single gilt profile
if selected_gilts:
    total_amount = sum(float(gilt["amount"]) for gilt in selected_gilts)
    avg_coupon = sum(gilt["coupon"] for gilt in selected_gilts) / len(selected_gilts)
    latest_maturity = max(gilt["maturity_date"] for gilt in selected_gilts)
    earliest_issue = min(gilt["issue_date"] for gilt in selected_gilts)
    next_coupon = min((gilt["next_coupon_date"] for gilt in selected_gilts if gilt["next_coupon_date"]), default="N/A")
    description = f"Aggregated Portfolio ({len(selected_gilts)} Gilts)"

    aggregated_gilt = {
        "description": description,
        "isin": "AGGREGATED",
        "coupon": avg_coupon,
        "maturity_date": latest_maturity,
        "issue_date": earliest_issue,
        "next_coupon_date": next_coupon,
        "amount": total_amount
    }

# Connect to Excel workbook
wb = xw.Book(excel_file)
try:
    ws = wb.sheets["PortfolioForAnalyseBonds"]
except:
    wb.sheets.add("PortfolioForAnalyseBonds")
    ws = wb.sheets["PortfolioForAnalyseBonds"]

# Clear existing content
ws.range("A1:Z1000").clear()

# Set up table headers
headers = ["Description", "ISIN", "Coupon (%)", "Maturity Date", "Issue Date", "Next Coupon Date", "Amount"]
ws.range("A1").value = headers

# Populate table with individual gilts and aggregated gilt
all_gilts = selected_gilts + [aggregated_gilt] if selected_gilts else []
for i, gilt in enumerate(all_gilts, start=2):
    ws.range(f"A{i}").value = gilt["description"]
    ws.range(f"B{i}").value = gilt["isin"]
    ws.range(f"C{i}").value = gilt["coupon"]
    ws.range(f"D{i}").value = gilt["maturity_date"]
    ws.range(f"E{i}").value = gilt["issue_date"]
    ws.range(f"F{i}").value = gilt["next_coupon_date"]
    ws.range(f"G{i}").value = gilt["amount"]

# Format the table
ws.range("A1:G1").font.bold = True
ws.range("A1:G1").interior.color = (173, 216, 230)  # Light blue background
ws.range("A1:G" + str(len(all_gilts) + 1)).columns.autofit()

# Save and close
wb.save()
wb.app.quit()