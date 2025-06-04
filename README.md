# StageQuantLibUK  
- To test the data analysis, please refer to the "Data Analyse" sheet. (Do not click on the "Calculate Metrics" button; I have already run the script manually due to a conflict between Excel and Python script threads. I am working on resolving this issue. Everything works perfectly otherwise, and the only remaining task is to manage this thread conflict.)  
- If you choose an ISIN, you should click on the "Hide" button, then on "Show" to update the related data.  
- The metrics are available in the "Result" sheet and were evaluated as of 2024-06-01.  
- Regarding the "Spot Rates" sheet, we fill it out manually, and then I execute the `ExportSpotToJson.py` script from VS Code. Running it directly in Excel takes too long and causes a freeze. I am looking for a solution to this issue. However, when the script is run from VS Code, everything works smoothly, indicating a problem related to the Excel interface.
