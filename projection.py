import json
import logging
import os
import sys
from datetime import datetime, timedelta
import pandas as pd
import QuantLib as ql

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('projection.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

# Get the base directory (where projection.py is located)
base_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(base_dir, "Data", "data.json")
output_path = os.path.join(base_dir, "Data", "projection.json")

def project_bond_values(bond_data):
    """
    Project bond prices and modified durations using a fixed implied yield.
    Returns a list of projections in the format:
    [{"Projection Date": "YYYY-MM-DD", "Clean Price Projected": float, "Modified Duration Projected": float}, ...]
    """
    try:
        # Extract bond data
        isin = bond_data.get('isin')
        description = bond_data.get('description')
        evolution_date = bond_data.get('evolution_date')
        maturity_date = bond_data.get('maturity_date')
        issue_date = bond_data.get('issue_date')
        implied_yield = bond_data.get('yield')  # In percentage (e.g., 4.50596904754639)
        coupon_rate = bond_data.get('coupon_rate')  # Already in decimal (e.g., 0.0125 for 1.25%)
        frequency = bond_data.get('frequency')  # 2 for semiannual
        proj_frequency = bond_data.get('proj_frequency')  # e.g., 'trimestrielle'

        logging.info(f"Projecting bond values with data: {bond_data}")

        # Convert dates to datetime objects
        evolution_date_dt = pd.to_datetime(evolution_date, format='%Y-%m-%d', errors='coerce')
        maturity_date_dt = pd.to_datetime(maturity_date, format='%Y-%m-%d', errors='coerce')
        issue_date_dt = pd.to_datetime(issue_date, format='%Y-%m-%d', errors='coerce')

        if pd.isna(evolution_date_dt) or pd.isna(maturity_date_dt) or pd.isna(issue_date_dt):
            logging.error("Invalid date format in bond data")
            raise ValueError("Invalid date format in Issue Date, Evolution Date, or Maturity Date")

        # Convert dates to QuantLib format
        evolution_date_ql = ql.Date(evolution_date_dt.day, evolution_date_dt.month, evolution_date_dt.year)
        maturity_date_ql = ql.Date(maturity_date_dt.day, maturity_date_dt.month, maturity_date_dt.year)
        issue_date_ql = ql.Date(issue_date_dt.day, issue_date_dt.month, issue_date_dt.year)

        # Check if evolution date is after maturity date
        if evolution_date_ql >= maturity_date_ql:
            logging.error("Evolution date is on or after maturity date")
            raise ValueError("Evolution date must be before maturity date")

        # Set up QuantLib conventions
        calendar = ql.UnitedKingdom()
        day_count = ql.ActualActual(ql.ActualActual.ISMA)
        face_amount = 100.0  # Ensure this is a float and non-zero
        coupon_rate_decimal = float(coupon_rate)  # Ensure coupon rate is a float
        implied_yield_decimal = float(implied_yield) / 100.0  # Convert yield from percentage to decimal

        # Create the bond schedule
        schedule = ql.Schedule(
            issue_date_ql, maturity_date_ql, ql.Period(ql.Semiannual), calendar,
            ql.Following, ql.Following, ql.DateGeneration.Backward, False
        )

        # Create the bond object
        bond = ql.FixedRateBond(
            1,  # Settlement days
            face_amount,  # Face amount (must be a positive float)
            schedule,
            [coupon_rate_decimal],  # Coupon rate as a list
            day_count
        )

        # Determine projection frequency
        if proj_frequency == 'mensuelle':
            delta = timedelta(days=30)  # Approximately 1 month
        elif proj_frequency == 'trimestrielle':
            delta = timedelta(days=90)  # Approximately 3 months
        elif proj_frequency == 'annuelle':
            delta = timedelta(days=365)  # 1 year
        elif proj_frequency == 'quinquennale':
            delta = timedelta(days=5*365)  # 5 years
        else:
            logging.error(f"Invalid projection frequency: {proj_frequency}")
            raise ValueError(f"Invalid projection frequency: {proj_frequency}")

        # Generate projection dates
        current_date = evolution_date_dt
        projection_dates = []
        while current_date <= maturity_date_dt:
            projection_dates.append(current_date)
            current_date += delta

        # Ensure the maturity date is included if it's close to the last projection
        if projection_dates[-1] < maturity_date_dt:
            projection_dates.append(maturity_date_dt)

        # Store projections
        projections = []

        for proj_date in projection_dates:
            proj_date_ql = ql.Date(proj_date.day, proj_date.month, proj_date.year)

            # Skip if projection date is on or after maturity
            if proj_date_ql >= maturity_date_ql:
                continue

            # Set the evaluation date
            ql.Settings.instance().evaluationDate = proj_date_ql

            # Calculate settlement date
            settlement_date = calendar.advance(proj_date_ql, 1, ql.Days)

            # Price the bond using the fixed implied yield
            clean_price = bond.cleanPrice(
                implied_yield_decimal, day_count, ql.Compounded, ql.Semiannual, settlement_date
            )

            # Calculate modified duration
            modified_duration = ql.BondFunctions.duration(
                bond, implied_yield_decimal, day_count, ql.Compounded, ql.Semiannual,
                ql.Duration.Modified, settlement_date
            )

            # Add to projections
            projections.append({
                "Projection Date": proj_date.strftime('%Y-%m-%d'),
                "Clean Price Projected": round(clean_price, 6),
                "Modified Duration Projected": round(modified_duration, 6)
            })

        return projections

    except Exception as e:
        logging.error(f"Error during projection: {str(e)}")
        raise

def main():
    try:
        # Load bond data from data.json
        logging.info(f"Loading bond data from {data_path}")
        with open(data_path, 'r') as f:
            bond_data = json.load(f)
        logging.info(f"Successfully loaded bond data: {bond_data}")

        # Project bond values
        projections = project_bond_values(bond_data)

        # Write projections to projection.json
        with open(output_path, 'w') as f:
            json.dump(projections, f, indent=4)
        logging.info(f"Successfully wrote projections to {output_path}")

    except Exception as e:
        logging.error(f"Main execution failed: {str(e)}")
        # Write an empty list to projection.json to indicate failure
        with open(output_path, 'w') as f:
            json.dump([], f)
        sys.exit(1)

if __name__ == "__main__":
    main()