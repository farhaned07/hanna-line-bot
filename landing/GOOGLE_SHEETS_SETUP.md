# Google Sheets Real-time Counter Setup

To connect your website to a real Google Sheet for the counters, follow these steps:

## 1. Create the Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new sheet.
2. Rename the sheet tab (at the bottom) to `Config` (optional, but good for organization).
3. Set up the following cells:
   - **Cell A1**: `TotalSpots`
   - **Cell B1**: `2000`
   - **Cell A2**: `ClaimedSpots` (This is your "Social Proof" number)
   - **Cell B2**: `28417` (or your current number of users)

## 2. Create the Google Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in `Code.gs` and paste the following:

```javascript
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // Gets the first sheet
  
  // Assuming B1 is Total and B2 is Claimed (Social Proof)
  var total = sheet.getRange("B1").getValue();
  var claimed = sheet.getRange("B2").getValue();
  var remaining = total - claimed; // Or calculate however you want
  
  var data = {
    total: total,
    claimed: claimed, // This will be used for the "28k+ people" counter
    remaining: remaining // This can be used for "spots left" if you want
  };
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Optional: If you want to increment the counter via API
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var currentClaimed = sheet.getRange("B2").getValue();
  sheet.getRange("B2").setValue(currentClaimed + 1);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success", newClaimed: currentClaimed + 1}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy as Web App
1. Click **Deploy** > **New deployment**.
2. Click the "Select type" gear icon > **Web app**.
3. Fill in the details:
   - **Description**: `Hanna Counter API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (This is crucial for your website to access it without login).
4. Click **Deploy**.
5. **Copy the Web App URL** (it starts with `https://script.google.com/macros/s/...`).

## 4. Update Your Website
1. Open `src/constants.tsx`.
2. Paste your Web App URL into the `GOOGLE_SHEETS_API_URL` constant.
