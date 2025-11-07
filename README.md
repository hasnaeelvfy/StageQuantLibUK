StageQuantLibUK Project Overview

Objective:
The goal of this project is to create an Excel-based application that interfaces with QuantLib to value financial instruments, particularly fixed-rate bonds. The application will allow for data exchange between Excel and Python, leveraging the QuantLib library to perform financial computations. The process will be self-hosted, with no usage limits.

Key Objectives:

Work Environment:

Work in a GitHub environment for version control.

Use Visual Studio Code (VS Code) and a Python Virtual Environment.

Utilize Xlwings for data exchange between Excel and Python.

Implement JSON to formalize data exchange with QuantLib.

Functionality:

Develop an application with an Excel interface for defining and pricing financial instruments (specifically bonds) using QuantLib.

Utilize real-world data to define and price UK Government bonds (Gilt data) and compare the results with actual market prices.

Project Steps:

Step 0: List the key data required to define and price bonds in QuantLib.
Step 1: Set up Xlwings to enable data flow (both input and output) and Python execution directly from Excel.

Step 2: Gather Instrument Data in QuantLib.
This step involves creating bond instruments without prices using the available data.

Step 3: Import Curve Data into QuantLib.
The curve data will be used to price the bond instruments created in Step 1.

Step 4: Compare prices from QuantLib to actual prices obtained from Tradeweb or similar sources.

Step 5: Adjust or correct any discrepancies between the QuantLib and Tradeweb prices, taking into account factors such as timing differences.

Step 6: Produce key metrics (e.g., clean price, dirty price, accrued amount) and report the results in Excel.

Data Components:

The data can be broken into three parts:

Bonds Data:

Information about coupons, coupon dates, coupon frequency, and bond maturity.

Sources: Tradeweb FTSE Gilt Closing Prices or Gilt Market InSite.

Tradeweb Market InSite:

Provides the Gilt prices at a specific date.

Spot Rates (Yield Curves):

The Bank of England provides the Gilt Spot Rates via their official website.

Key Concepts and Tools:

QuantLib: A free/open-source library for quantitative finance used to price and model financial instruments, especially bonds.

Xlwings: A Python library used to allow Excel to interface with Python, enabling seamless data exchange.

Fixed-Rate Bonds: Focus on using fixedRateBond for the initial development.

Inflation-Linked Bonds: These will be explored later in the project.

Outputs and Metrics:

The key outputs from the QuantLib model include:

Cashflows: Made up of coupons and redemption payments (no spot rates required for these).

Price-related Outputs: Clean price, dirty price, and accrued amount.

Example Data and References:

QuantLib Tutorials:

QuantLib Python Tutorials with Examples

Tradeweb Market InSite:

Provides Gilt Prices.

Gilt Market (UK Government Bonds):

Gilt Market
 provides background on issued Gilt bonds.

Bank of England Yield Curves:

Yield Curves
 for obtaining Gilt Spot Rates.

Notes:

Testing and Debugging:
If using the “Data Analyse” sheet, do not click the "Calculate Metrics" button. The script runs fine manually, but there’s a known issue with the Excel-Python thread conflict.

Spot Rate Data:
You’ll need to manually fill out the "Spot Rates" sheet and execute the ExportSpotToJson.py script from VS Code (Excel causes issues when running the script directly).

Gilt Types:
Focus will be on Fixed-Rate Bonds for now. Inflation-linked bonds will be tackled later.

Final Deliverables:

A working Excel interface with Python and QuantLib integration.

A set of fixed-rate bonds priced with QuantLib.

Comparison of QuantLib prices with actual market data from Tradeweb.

A comprehensive report generated in Excel that includes key metrics.
Contributors:
H4MZ4-M44D4R
hasnaeelvfy

Screenshots:

Below are some screenshots showing the project setup:
- <img width="1919" height="1063" alt="image" src="https://github.com/user-attachments/assets/f8a5da10-aa61-4885-90fa-aee6e37dc173" />
<img width="1893" height="1061" alt="image" src="https://github.com/user-attachments/assets/36e1fca5-4a27-4191-a155-113ffeb800c8" />
<img width="1908" height="1057" alt="image" src="https://github.com/user-attachments/assets/9a01751d-586e-4f76-9bbc-e68c78b5b8d5" />
<img width="1919" height="998" alt="image" src="https://github.com/user-attachments/assets/808ded77-bb9a-45a8-b172-83248f5f1c3e" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/97ac0a2e-b019-47d2-a239-63f2d6516219" />
<img width="1913" height="1071" alt="image" src="https://github.com/user-attachments/assets/5c8373e7-c355-47b8-b152-49a4046f2496" />



