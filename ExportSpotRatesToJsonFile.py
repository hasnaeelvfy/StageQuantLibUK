import xlwings as xw
import json
import os
import pandas as pd
import datetime

def round_values(value):
    if isinstance(value, (int, float)) and pd.notna(value):
        return round(value, 2)
    return value

def calculate_average_years(date_eval, maturity_years):
    return sum(maturity_years) / len(maturity_years) if maturity_years else 0

def export_spot_rates_to_json():
    excel_file_name = "obligation.xlsm"
    print(f"Tentative d'accès au classeur Excel : {excel_file_name}")

    try:
        wb = xw.Book(excel_file_name)
    except Exception as e:
        print(f"Erreur lors de l'ouverture du classeur Excel : {e}")
        return

    if 'SpotRates' not in [s.name for s in wb.sheets]:
        print("Erreur : Feuille 'SpotRates' non trouvée.")
        return

    sheet = wb.sheets['SpotRates']
    used_range = sheet.used_range.value
    print(f"Données brutes du used_range : {used_range}")

    if not used_range or len(used_range) < 3 or len(used_range[0]) < 2:
        print("Erreur : La feuille 'SpotRates' est vide ou mal formatée.")
        return

    # Extraction des maturités
    maturities = []
    years = used_range[0][1:] if used_range else []
    for y in years:
        if pd.notna(y):
            try:
                maturity = float(y)
                maturities.append(maturity)
            except:
                maturities.append(None)
        else:
            maturities.append(None)

    if not any(m is not None for m in maturities):
        print("Erreur : Aucune maturité valide trouvée.")
        return

    max_maturity = max([m for m in maturities if m is not None])
    print(f"Maximum de la courbe des spots : {max_maturity} ans")

    json_data = {}
    for row in used_range[2:]:
        date_raw = row[0]
        if not date_raw:
            print(f"Avertissement : Ligne ignorée - Date manquante : {row}")
            continue
        try:
            date_eval = pd.to_datetime(date_raw, dayfirst=True)
            clean_date = date_eval.strftime('%Y-%m-%d')
        except Exception as e:
            print(f"Avertissement : Ligne ignorée - '{date_raw}' n'est pas une date valide : {e}")
            continue

        spot_rates = row[1:]
        formatted_rates = [round_values(v) if v is not None else None for v in spot_rates]

        if len(formatted_rates) != len(maturities):
            print(f"Avertissement : Ligne ignorée - Nombre de taux ({len(formatted_rates)}) ≠ maturités ({len(maturities)}) pour la date {clean_date}")
            continue

        entries = []
        for maturity, rate in zip(maturities, formatted_rates):
            if maturity is not None and rate is not None and rate != "N/A":
                entries.append({"year": maturity, "rate": rate})

        # Calcul de la moyenne des maturités valides
        average_maturity = calculate_average_years(date_eval, [e["year"] for e in entries])
        if average_maturity > max_maturity:
            print(f"⚠️ Alerte : La moyenne des maturités ({average_maturity:.2f} ans) dépasse le maximum de la courbe des spots ({max_maturity} ans) pour la date {clean_date}. Ligne ignorée.")
            continue

        if entries:
            json_data[clean_date] = entries
        else:
            print(f"Avertissement : Aucune donnée valide pour la date {clean_date}")

    if not json_data:
        print("Erreur : Aucune donnée valide à exporter dans le JSON.")
        return

    spot_rates_dir = os.path.join(os.getcwd(), "SpotRates")
    if not os.path.exists(spot_rates_dir):
        os.makedirs(spot_rates_dir)

    json_file_path = os.path.join(spot_rates_dir, "SpotRates.json")
    try:
        with open(json_file_path, 'w') as f:
            json.dump(json_data, f, indent=2)
        print(f"✅ Fichier JSON exporté avec succès : {json_file_path}")
    except Exception as e:
        print(f"Erreur d'écriture du fichier JSON : {e}")
        return

if __name__ == "__main__":
    export_spot_rates_to_json()
