import json
import os
from datetime import datetime, timedelta
import QuantLib as ql


def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        raise ValueError(f"Format de date invalide : {date_str}")


def quantlib_date(dt):
    return ql.Date(dt.day, dt.month, dt.year)


def generate_projection_dates(evaluation_date, frequency):
    dates = []
    eval_date = parse_date(evaluation_date)
    current_date = eval_date

    if frequency == 'mensuelle':
        for _ in range(60):
            dates.append(current_date.strftime('%Y-%m-%d'))
            current_date += timedelta(days=30)
    elif frequency == 'trimestrielle':
        for _ in range(20):
            dates.append(current_date.strftime('%Y-%m-%d'))
            current_date += timedelta(days=90)
    elif frequency == 'annuelle':
        for _ in range(5):
            dates.append(current_date.strftime('%Y-%m-%d'))
            current_date += timedelta(days=365)
    elif frequency == 'cinq_ans':
        projection_date = eval_date + timedelta(days=5 * 365)
        dates.append(projection_date.strftime('%Y-%m-%d'))
    return dates


def main():
    data_file = os.path.join(os.getcwd(), 'Data', 'data.json')
    output_file = os.path.join(os.getcwd(), 'Data', 'projection.json')

    try:
        with open(data_file, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"[ERREUR] Lecture de data.json : {e}")
        return

    evaluation_date = data['evolution_date']
    proj_frequency = data['proj_frequency']
    bonds = data['bonds']

    projection_dates = generate_projection_dates(evaluation_date, proj_frequency)
    if not projection_dates:
        print("[ERREUR] Aucune date de projection générée.")
        return

    day_count = ql.ActualActual(ql.ActualActual.Bond)
    projections = []

    for proj_date in projection_dates:
        print(f"\n🟡 Projection pour la date : {proj_date}")

        total_clean_price = 0
        total_modified_duration = 0
        total_dirty_price = 0

        for bond in bonds:
            try:
                isin = bond['isin']
                dirty_price = float(bond['dirty_price'])
                clean_price = float(bond['clean_price'])
                coupon = float(bond['coupon']) / 100.0
                implied_yield = float(bond['implied_yield'])
                maturity_date = parse_date(bond['maturity_date'])
                issue_date = parse_date(bond['issue_date'])

                if parse_date(proj_date) > maturity_date:
                    print(f"⏩ ISIN {isin} ignoré (projection > maturité: {maturity_date})")
                    continue

                # Setup bond
                calendar = ql.UnitedKingdom()
                schedule = ql.Schedule(
                    quantlib_date(issue_date),
                    quantlib_date(maturity_date),
                    ql.Period(ql.Semiannual),
                    calendar,
                    ql.Following, ql.Following,
                    ql.DateGeneration.Backward, False
                )

                bond_obj = ql.FixedRateBond(
                    2, 100.0, schedule, [coupon], day_count
                )

                ql.Settings.instance().evaluationDate = quantlib_date(parse_date(proj_date))

                flat_curve = ql.FlatForward(
                    quantlib_date(parse_date(proj_date)),
                    implied_yield, day_count,
                    ql.Compounded, ql.Semiannual
                )
                engine = ql.DiscountingBondEngine(ql.YieldTermStructureHandle(flat_curve))
                bond_obj.setPricingEngine(engine)

                # Calculs
                proj_clean = bond_obj.cleanPrice()
                proj_dur = ql.BondFunctions.duration(
                    bond_obj, implied_yield, day_count,
                    ql.Compounded, ql.Semiannual,
                    ql.Duration.Modified
                )

                total_clean_price += proj_clean * dirty_price
                total_modified_duration += proj_dur * dirty_price
                total_dirty_price += dirty_price

                print(f"✅ ISIN {isin}: price={proj_clean:.4f}, dur={proj_dur:.4f}, weight={dirty_price:.2f}")

            except Exception as e:
                print(f"❌ Erreur ISIN {bond.get('isin', '???')} : {e}")
                continue

        if total_dirty_price > 0:
            avg_clean_price = total_clean_price / total_dirty_price
            avg_duration = total_modified_duration / total_dirty_price

            projections.append({
             "Projection Date": proj_date,
             "Clean Price Projected": round(avg_clean_price, 6),
              "Modified Duration Projected": round(avg_duration, 6)
                })


            print(f"\n✅ Ajout projection: {proj_date} | Prix moy: {avg_clean_price:.4f}, Duration moy: {avg_duration:.4f}")
        else:
            print("⚠️ Aucune obligation active pour cette date. Ignorée.")

    try:
        with open(output_file, 'w') as f:
            json.dump({"projections": projections}, f, indent=4)
        print(f"\n📁 Projections sauvegardées dans: {output_file}")
    except Exception as e:
        print(f"[ERREUR] Sauvegarde projection.json : {e}")


if __name__ == "__main__":
    main()
#             logging.info(f"Successfully wrote projections to {output_excel_path}")