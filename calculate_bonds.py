import xlwings as xw
import pandas as pd
import QuantLib as ql
from datetime import datetime
import json
from pathlib import Path
import os

def interpolate_curve(spot_data, date_before_str, date_after_str, target_date_str):
    fmt = "%Y-%m-%d"
    date_before = datetime.strptime(date_before_str, fmt)
    date_after = datetime.strptime(date_after_str, fmt)
    date_target = datetime.strptime(target_date_str, fmt)

    alpha = (date_target - date_before).days / (date_after - date_before).days

    curve_before = {e["year"]: e["rate"] for e in spot_data[date_before_str]}
    curve_after = {e["year"]: e["rate"] for e in spot_data[date_after_str]}

    interpolated = []
    for year in curve_before:
        if year in curve_after:
            rate = curve_before[year] + alpha * (curve_after[year] - curve_before[year])
            interpolated.append({"year": year, "rate": rate})
    return interpolated

def load_spot_curve_from_json(filename, eval_date_str):
    print(f"📂 Chargement du fichier JSON: {filename}")
    
    eval_dt = ql.DateParser.parseISO(eval_date_str)
    ql.Settings.instance().evaluationDate = eval_dt
    print(f"📅 Date d'évaluation : {eval_dt}")

    with open(filename, 'r') as f:
        data = json.load(f)

    spot_list = data.get(eval_date_str, [])
    
    if not spot_list:
        print(f"⚠ Pas de données pour {eval_date_str}, tentative d'interpolation...")
        all_dates = sorted(data.keys())
        before = None
        after = None

        for d in all_dates:
            if d < eval_date_str:
                before = d
            elif d > eval_date_str and before:
                after = d
                break

        if not before or not after:
            raise ValueError(f"❌ Impossible d'interpoler : il manque une date avant ou après {eval_date_str}")

        print(f"🔄 Interpolation entre {before} et {after} pour {eval_date_str}")
        spot_list = interpolate_curve(data, before, after, eval_date_str)

    print(f"📊 Données de spot obtenues : {len(spot_list)} entrées")
    for e in spot_list:
        print(f"   - Year: {e['year']} | Rate: {e['rate']}")

    calendar = ql.UnitedKingdom()
    day_count = ql.ActualActual(ql.ActualActual.ISMA)
    dates = [eval_dt]
    rates = [spot_list[0]["rate"] / 100.0]

    for entry in spot_list:
        try:
            years = float(entry["year"])
            rate = entry["rate"] / 100

            if years <= 0:
                print(f"⚠ Ignoré: maturité non positive ({years} ans)")
                continue

            days = int(round(years * 365))
            date = calendar.advance(eval_dt, ql.Period(days, ql.Days))

            if date <= eval_dt:
                print(f"⚠ Ignoré: Date {date} antérieure ou égale à {eval_dt}")
                continue

            print(f"✅ Ajout : {date} | {rate:.4%} | Maturité: {years} ans")
            dates.append(date)
            rates.append(rate)

        except (KeyError, ValueError, TypeError) as e:
            print(f"⚠ Erreur dans une entrée de spot rate: {entry} | Exception: {e}")

    print(f"📆 Total dates valides : {len(dates)}")
    print(f"📈 Total rates valides : {len(rates)}")

    if len(dates) < 2:
        raise ValueError("❌ Pas assez de dates valides pour construire la courbe de taux")

    try:
        spot_curve = ql.ZeroCurve(dates, rates, day_count, calendar)
        print("✅ Courbe ZeroCurve construite avec succès")
    except Exception as e:
        print("❌ Erreur lors de la création de la ZeroCurve:", e)
        raise

    return ql.YieldTermStructureHandle(spot_curve)

def price_and_analyze_bond_with_spot(bond_data, eval_date_ql, spot_curve_handle):
    calendar = ql.UnitedKingdom()
    day_count = ql.ActualActual(ql.ActualActual.ISMA)
    
    issue_date = pd.to_datetime(bond_data['issue_date'], format='%Y-%m-%d', errors='coerce')
    maturity_date = pd.to_datetime(bond_data['maturity_date'], format='%Y-%m-%d', errors='coerce')
    
    if pd.isna(issue_date) or pd.isna(maturity_date):
        return {**bond_data, 'Error': "Format de date invalide dans Issue Date ou Maturity"}

    issue_date_ql = ql.Date(issue_date.day, issue_date.month, issue_date.year)
    maturity_date_ql = ql.Date(maturity_date.day, maturity_date.month, maturity_date.year)

    print(f"🔍 Debug - Eval Date: {eval_date_ql}, Maturity Date: {maturity_date_ql}")
    if eval_date_ql >= maturity_date_ql:
        return {**bond_data, 'Error': "Bond has reached maturity"}

    schedule = ql.Schedule(
        issue_date_ql, maturity_date_ql, ql.Period(ql.Semiannual), calendar,
        ql.Following, ql.Following, ql.DateGeneration.Backward, False
    )
    
    coupon_rate = bond_data['coupon'] / 100 if bond_data['coupon'] is not None else 0.0
    bond = ql.FixedRateBond(1, 100, schedule, [coupon_rate], day_count)

    settlement_date = calendar.advance(eval_date_ql, 1, ql.Days)

    bond.setPricingEngine(ql.DiscountingBondEngine(spot_curve_handle))

    clean_price = bond.cleanPrice()
    dirty_price = bond.dirtyPrice()
    accrued_interest = bond.accruedAmount(settlement_date)
    
    implied_yield = bond.bondYield(clean_price, day_count, ql.Compounded, ql.Semiannual, settlement_date)
    
    modified_duration = ql.BondFunctions.duration(
        bond, implied_yield, day_count, ql.Compounded, ql.Semiannual, ql.Duration.Modified, settlement_date
    )
    convexity = ql.BondFunctions.convexity(
        bond, implied_yield, day_count, ql.Compounded, ql.Semiannual, settlement_date
    )

    pv01 = bond.cleanPrice(implied_yield - 0.0001, day_count, ql.Compounded, ql.Semiannual, settlement_date) - clean_price

    # Expanded sensitivity analysis (excluding Trend)
    P0 = clean_price
    D = modified_duration
    C = convexity
    yield_shifts = [-0.02, -0.015, -0.01, -0.005, 0.0, 0.005, 0.01, 0.015, 0.02]
    sensitivities = {}
    for dy in yield_shifts:
        deltaP = -D * dy * P0 + 0.5 * C * (dy**2) * P0
        P_new = P0 + deltaP
        sensitivities[f"{dy*100:+.1f}%"] = {
            "Price Approx": round(P_new, 6),
            "ΔP": round(deltaP, 6),
            "ΔP (%)": round(deltaP / P0 * 100, 4)
        }

    cashflows = []
    for cf in bond.cashflows():
        cf_date = cf.date()
        if cf_date > settlement_date:
            cashflows.append({
                'Date': cf_date.ISO(),
                'Amount': round(cf.amount(), 6)
            })

    return {
        **bond_data,
        'Clean Price Calculated': clean_price,
        'Dirty Price Calculated': dirty_price,
        'Accrued Interest Calculated': accrued_interest,
        'Modified Duration Calculated': modified_duration,
        'Convexity Calculated': convexity,
        'PV01 Calculated': pv01,
        'Sensitivities (Approx)': sensitivities,
        'Implied Yield': implied_yield * 100,
        'Cashflows': cashflows
    }

def create_fresh_results_sheet(wb):
    try:
        for sheet_name in ["Results"]:
            if sheet_name in [sheet.name for sheet in wb.sheets]:
                wb.sheets[sheet_name].delete()
                print(f"🗑 Existing '{sheet_name}' sheet deleted.")
        results_sht = wb.sheets.add(name="Results", after=wb.sheets[-1])
        print("📄 New 'Results' sheet created.")
        return results_sht
    except Exception as e:
        print(f"❌ Error managing sheets: {str(e)}")
        raise

def main():
    # Set evaluation date to July 1, 2024
    eval_date = datetime(2024, 6, 1)
    eval_date_str = eval_date.strftime('%Y-%m-%d')
    eval_date_ql = ql.Date(eval_date.day, eval_date.month, eval_date.year)
    ql.Settings.instance().evaluationDate = eval_date_ql
    print(f"📅 Date d'évaluation : {eval_date_str}")

    # Load spot curve from SpotRates/SpotRates.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "SpotRates", "SpotRates.json")
    try:
        spot_curve_handle = load_spot_curve_from_json(json_path, eval_date_str)
    except Exception as e:
        print(f"❌ Erreur lors du chargement de la courbe de taux spot : {str(e)}")
        return

    # Load JSON data
    json_path_gilts = os.path.join(script_dir, "temp", "gilts.json")
    json_file = Path(json_path_gilts)
    if not json_file.exists():
        print(f"❌ Fichier {json_file} non trouvé.")
        return

    with open(json_file, 'r', encoding='utf-8') as f:
        bond_data_list = json.load(f)

    results = []
    cashflows_by_isin = {}
    for bond_data in bond_data_list:
        bond_metrics = price_and_analyze_bond_with_spot(bond_data, eval_date_ql, spot_curve_handle)
        print(f"📊 Résultats pour {bond_data.get('description', 'Unknown')}: {bond_metrics}")
        
        cashflows = bond_metrics.pop('Cashflows', [])
        results.append(bond_metrics)

        if not cashflows:
            print(f"⚠ Aucun cashflow généré pour {bond_data.get('description', 'Unknown')}")
        else:
            print(f"💰 {len(cashflows)} cashflows générés pour {bond_data.get('description', 'Unknown')}")
            isin = bond_data.get('isin', 'Unknown')
            cashflows_by_isin[isin] = cashflows

    # Save cashflows to JSON file
    cashflows_dir = os.path.join(script_dir, "CashFlows")
    os.makedirs(cashflows_dir, exist_ok=True)  # Create CashFlows directory if it doesn't exist
    cashflows_json_path = os.path.join(cashflows_dir, "cashflows.json")
    try:
        with open(cashflows_json_path, 'w', encoding='utf-8') as f:
            json.dump(cashflows_by_isin, f, indent=4)
        print(f"💾 Cashflows saved to {cashflows_json_path}")
    except Exception as e:
        print(f"❌ Error saving cashflows to JSON: {str(e)}")

    # Prepare results DataFrame with sensitivity columns (excluding Trend)
    results_df = pd.DataFrame(results)
    cols = [
        'description', 'isin', 'coupon', 'maturity_date', 'issue_date',
        'Clean Price Calculated', 'Dirty Price Calculated', 'Accrued Interest Calculated',
        'Modified Duration Calculated', 'Convexity Calculated', 'PV01 Calculated', 'Implied Yield'
    ]
    
    # Add sensitivity columns (excluding Trend) with safe dictionary access
    yield_shifts = [-0.02, -0.015, -0.01, -0.005, 0.0, 0.005, 0.01, 0.015, 0.02]
    for dy in yield_shifts:
        col_name = f"Price_{dy*100:+.1f}%"
        col_delta = f"ΔP_{dy*100:+.1f}%"
        col_delta_pct = f"ΔP(%)_{dy*100:+.1f}%"
        results_df[col_name] = results_df['Sensitivities (Approx)'].apply(
            lambda x: x.get(f"{dy*100:+.1f}%", {}).get("Price Approx", 0) if isinstance(x, dict) else 0
        )
        results_df[col_delta] = results_df['Sensitivities (Approx)'].apply(
            lambda x: x.get(f"{dy*100:+.1f}%", {}).get("ΔP", 0) if isinstance(x, dict) else 0
        )
        results_df[col_delta_pct] = results_df['Sensitivities (Approx)'].apply(
            lambda x: x.get(f"{dy*100:+.1f}%", {}).get("ΔP (%)", 0) if isinstance(x, dict) else 0
        )
    
    cols.extend([col for col in results_df.columns if col.startswith("Price_") or col.startswith("ΔP_")])
    cols.append('Error')
    results_df = results_df.reindex(columns=[col for col in cols if col in results_df.columns])

    # Remplacer les NaN par 0 pour éviter les erreurs
    results_df = results_df.fillna(0)

    # Create cashflows_df only for console output (not for Excel)
    cashflows_output = []
    for isin, cashflows in cashflows_by_isin.items():
        for cf in cashflows:
            bond_data = next((b for b in bond_data_list if b.get('isin') == isin), {})
            cf_row = {
                'Description': bond_data.get('description', 'Unknown'),
                'ISIN': isin,
                'Coupon': bond_data.get('coupon', 0.0),
                'Maturity Date': bond_data.get('maturity_date', ''),
                'Issue Date': bond_data.get('issue_date', ''),
                'Date': cf.get('Date', ''),
                'Amount': cf.get('Amount', 0.0)
            }
            cashflows_output.append(cf_row)

    cashflows_df = pd.DataFrame(cashflows_output)
    cf_cols = ['Description', 'ISIN', 'Coupon', 'Maturity Date', 'Issue Date', 'Date', 'Amount']
    cashflows_df = cashflows_df.reindex(columns=[col for col in cf_cols if col in cashflows_df.columns])

    # Vérification du DataFrame cashflows_df
    print(f"🔍 Contenu de cashflows_df : {len(cashflows_df)} lignes")
    if not cashflows_df.empty:
        print("📋 Premières lignes de cashflows_df :")
        print(cashflows_df.head())

    wb = None
    excel_available = True
    try:
        wb = xw.Book.caller()
        print(f"📑 Classeur Excel détecté : {wb.name}")
    except Exception as e:
        print(f"⚠ Excel non accessible via xlwings : {str(e)}. Mode standalone activé.")
        excel_available = False

    if excel_available and wb is not None:
        try:
            results_sht = create_fresh_results_sheet(wb)

            # Write results to Excel (simple write without formatting)
            print("📝 Écriture des résultats dans la feuille 'Results'")
            print("🔍 DEBUG: Tentative d'écriture des en-têtes dans 'Results'")
            results_sht.range('A1').value = results_df.columns.tolist()
            print("🔍 DEBUG: En-têtes écrits avec succès dans 'Results'")
            print("🔍 DEBUG: Tentative d'écriture des données dans 'Results'")
            results_sht.range('A2').value = results_df.values.tolist()
            print("🔍 DEBUG: Données écrites avec succès dans 'Results'")
            print("🔍 DEBUG: Tentative de mise en gras des en-têtes dans 'Results'")
            results_sht.range('A1').expand('right').api.Font.Bold = True
            print("🔍 DEBUG: En-têtes mis en gras avec succès dans 'Results'")
            
            # Aucune étape de formatage numérique

            print("🔍 DEBUG: Tentative d'ajustement automatique des colonnes dans 'Results'")
            results_sht.autofit('c')
            print("🔍 DEBUG: Ajustement automatique des colonnes réussi dans 'Results'")

            print("🔍 DEBUG: Tentative de sauvegarde du classeur")
            wb.save()
            print("💾 Workbook saved.")
        except Exception as e:
            print(f"❌ Error writing to Excel: {str(e)}")
            print("📋 Results (falling back to console):")
            print(results_df)
    else:
        print("📋 Results (Excel not available, displaying in console):")
        print(results_df)

if __name__ == "__main__":
    try:
        xw.Book("obligation.xlsm").set_mock_caller()
        main()
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution principale : {str(e)}")