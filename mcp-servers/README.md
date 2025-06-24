# Google Sheets Server

This server provides tools to interact with Google Sheets, allowing you to create new spreadsheets and add data to existing ones.

## Setup

1. Install dependencies:
```bash
uv pip install --python /path/to/uv/python google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

2. Set up Google Sheets API:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Create credentials (OAuth 2.0 Client ID)
   - Download the credentials and save as `credentials.json` in the `mcp-server` directory

3. Run the server:
```bash
uv run sheets_server.py
```

## Usage

The server provides two main tools:

1. `create_sheet(title: str)`: Creates a new Google Sheet
   - Returns the spreadsheet ID and other details

2. `add_to_sheet(spreadsheet_id: str, range_name: str, values: list)`: Adds data to a Google Sheet
   - `spreadsheet_id`: The ID of the spreadsheet to update
   - `range_name`: The A1 notation of the values to update (e.g., 'Sheet1!A1:B2')
   - `values`: List of lists containing the values to add

## Testing the Server

To test the server, use this prompt in Claude:

```
I want to test the Google Sheets server. Please:
1. Create a new sheet titled "Test Sheet"
2. Add some sample data with headers and a few rows
3. Show me the results of both operations

The data should include:
- Headers: Name, Age, City
- A few sample rows of data
```

Example response will look like:
```python
# Create a new sheet
result = create_sheet("Test Sheet")
spreadsheet_id = result['spreadsheetId']

# Add data to the sheet
values = [
    ["Name", "Age", "City"],
    ["John", "30", "New York"],
    ["Alice", "25", "London"],
    ["Bob", "35", "Paris"]
]
add_to_sheet(spreadsheet_id, "Sheet1!A1:C4", values)
```

## Authentication

The first time you run the server:
1. It will open a browser window for Google authentication
2. You may see an "unverified app" warning - click "Advanced" and "Go to [App Name]"
3. Select your Google account and grant the necessary permissions
4. After authentication, credentials will be saved in `token.pickle` for future use

Note: During development, you can proceed with the unverified app warning. For production use, you'll need to complete Google's verification process.


Script Writing: Script Writer (SW) (takes theme/criteria, uses research).
Character/Actor Generation: Character/Actor Generation (AC) (creates custom actors).
Storyboarding: Story Boarding (SB) (takes script, creates frame-by-frame details, uses VLM, provides feedback to DOP).
Image Generation (DOP): DOP (takes feedback from SB and actor data, generates images for each frame).
Audio Generation (Narrator): Narrator (takes text from SB, generates audio).
Editing & Post-Production: Editing & Post-Production (takes frames from DOP and audio from Narrator, creates final video).
Final Video: The output.
YouTube Upload: The user's requirement, handled by the existing youtube_server.