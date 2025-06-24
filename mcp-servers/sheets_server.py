import sys
import os
print("Starting imports...", file=sys.stderr)
print(f"Python executable: {sys.executable}", file=sys.stderr)
print(f"Python path: {sys.path}", file=sys.stderr)

try:
    from mcp.server.fastmcp import FastMCP
    print("MCP imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Failed to import MCP: {e}", file=sys.stderr)
    sys.exit(1)

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    print("Google packages imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Failed to import Google packages: {e}", file=sys.stderr)
    print("Please run: uv pip install --system google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client", file=sys.stderr)
    sys.exit(1)

import pickle

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

print("Starting Google Sheets Server...", file=sys.stderr)

# Create an MCP server
mcp = FastMCP("Google Sheets Server")

def get_google_sheets_service():
    """Get or create Google Sheets service."""
    print("Initializing Google Sheets service...", file=sys.stderr)
    creds = None
    
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    credentials_path = os.path.join(script_dir, 'credentials.json')
    token_path = os.path.join(script_dir, 'token.pickle')
    
    print(f"Looking for credentials at: {credentials_path}", file=sys.stderr)
    
    # The file token.pickle stores the user's access and refresh tokens
    if os.path.exists(token_path):
        print("Found existing credentials...", file=sys.stderr)
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        print("No valid credentials found. Starting authentication flow...", file=sys.stderr)
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired credentials...", file=sys.stderr)
            creds.refresh(Request())
        else:
            print("Starting new authentication flow...", file=sys.stderr)
            if not os.path.exists(credentials_path):
                print(f"Error: credentials.json not found at {credentials_path}", file=sys.stderr)
                raise FileNotFoundError(f"credentials.json not found at {credentials_path}")
            
            flow = InstalledAppFlow.from_client_secrets_file(
                credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        print("Saving credentials for future use...", file=sys.stderr)
        with open(token_path, 'wb') as token:
            pickle.dump(creds, token)

    print("Google Sheets service initialized successfully.", file=sys.stderr)
    return build('sheets', 'v4', credentials=creds)

@mcp.tool()
def add_to_sheet(spreadsheet_id: str, range_name: str, values: list) -> dict:
    """
    Add data to a Google Sheet.
    
    Args:
        spreadsheet_id: The ID of the spreadsheet to update
        range_name: The A1 notation of the values to update (e.g., 'Sheet1!A1:B2')
        values: List of lists containing the values to add
    
    Returns:
        dict: The response from the Google Sheets API
    """
    print(f"Adding data to sheet {spreadsheet_id} at range {range_name}...", file=sys.stderr)
    try:
        service = get_google_sheets_service()
        body = {
            'values': values
        }
        result = service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            body=body
        ).execute()
        print("Data added successfully.", file=sys.stderr)
        return result
    except Exception as e:
        print(f"Error adding data: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

@mcp.tool()
def create_sheet(title: str) -> dict:
    """
    Create a new Google Sheet.
    
    Args:
        title: The title of the new spreadsheet
    
    Returns:
        dict: The response from the Google Sheets API containing the new spreadsheet details
    """
    print(f"Creating new sheet with title: {title}", file=sys.stderr)
    try:
        service = get_google_sheets_service()
        spreadsheet = {
            'properties': {
                'title': title
            }
        }
        spreadsheet = service.spreadsheets().create(body=spreadsheet).execute()
        print(f"Sheet created successfully with ID: {spreadsheet.get('spreadsheetId')}", file=sys.stderr)
        return spreadsheet
    except Exception as e:
        print(f"Error creating sheet: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    print("Starting MCP server...", file=sys.stderr)
    mcp.run() 