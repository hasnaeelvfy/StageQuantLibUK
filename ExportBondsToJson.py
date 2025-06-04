# ExportBondsToJson.py

import xlwings as xw
import re
import json
from pathlib import Path

def gilts():
    input_file = Path('obligation.xlsm')
    output_file = Path('temp/gilts.json')
    output_file.parent.mkdir(parents=True, exist_ok=True)

    isin_pattern = re.compile(r'^[A-Z0-9]+$')
    coupon_pattern = re.compile(r'([\d\s\/¾½⅝⅞¼⅓⅔]+)%')

    fraction_map = {
        '½': '+0.5', '¼': '+0.25', '¾': '+0.75',
        '⅝': '+0.625', '⅞': '+0.875', '⅓': '+0.333', '⅔': '+0.666',
    }

    month_map = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    }

    def extract_coupon(description):
        match = coupon_pattern.search(description)
        if match:
            text = match.group(1).strip()
            for symbol, replacement in fraction_map.items():
                text = text.replace(symbol, replacement)
            text = re.sub(r'\s+', '+', text)
            try:
                return float(eval(text))
            except Exception as e:
                print(f"Error parsing coupon '{description}' → {text}: {e}")
        return None

    def format_date(val):
        return val.split(' ')[0] if isinstance(val, str) and ' ' in val else val

    def parse_coupon_schedule(schedule_str):
        match = re.match(r'(\d{1,2})\s+([A-Za-z]{3})/([A-Za-z]{3})', schedule_str)
        if match:
            day = match.group(1).zfill(2)
            month1 = month_map.get(match.group(2), '??')
            month2 = month_map.get(match.group(3), '??')
            return [f"{month1}-{day}", f"{month2}-{day}"]
        return [schedule_str]

    gilts_data = []

    app = xw.App(visible=False)
    try:
        wb = app.books.open(str(input_file))
        sheet = wb.sheets['ImportedData']
        used_range = sheet.used_range
        row_count = used_range.last_cell.row

        for row in range(1, row_count + 1):
            cells = [sheet.range((row, col)).value for col in range(1, 8)]
            first_cell = str(cells[0]).strip() if cells[0] else ''
            
            if "Index-linked Gilts" in first_cell:
                break
            if not first_cell or not cells[1]:
                continue

            cells = [str(cell).strip() if cell is not None else '' for cell in cells]
            isin = cells[1]
            third_cell = format_date(cells[2])
            fourth_cell = format_date(cells[3])
            sixth_cell = format_date(cells[5])

            if first_cell and isin and third_cell:
                if isin_pattern.fullmatch(isin):
                    coupon_value = extract_coupon(first_cell)
                    coupon_schedule_list = parse_coupon_schedule(cells[4])
                    gilts_data.append({
                        'description': first_cell,
                        'isin': isin,
                        'coupon': coupon_value,
                        'maturity_date': third_cell,
                        'issue_date': fourth_cell or None,
                        'coupon_schedule': coupon_schedule_list,
                        'next_coupon_date': sixth_cell or None,
                        'amount': cells[6] or None,
                    })
        wb.close()
    finally:
        app.quit()

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(gilts_data, f, indent=4, ensure_ascii=False)

    print(f"Exported {len(gilts_data)} gilts to {output_file}")

gilts()
