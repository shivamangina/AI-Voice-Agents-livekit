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
    from googleapiclient.http import MediaFileUpload
    print("Google packages imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Failed to import Google packages: {e}", file=sys.stderr)
    print("Please run: uv pip install --system google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client", file=sys.stderr)
    sys.exit(1)

import pickle
import requests
import tempfile
import mimetypes

# If modifying these scopes, delete the file token.pickle.
SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
]

print("Starting YouTube Publisher Server...", file=sys.stderr)

# Create an MCP server
mcp = FastMCP("YouTube Publisher Server")

def get_youtube_service():
    """Get or create YouTube service."""
    print("Initializing YouTube service...", file=sys.stderr)
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

    print("YouTube service initialized successfully.", file=sys.stderr)
    return build('youtube', 'v3', credentials=creds)

def download_video(url: str) -> str:
    """Download video from URL to a temporary file."""
    print(f"Downloading video from {url}...", file=sys.stderr)
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        with open(temp_file.name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"Video downloaded successfully to {temp_file.name}", file=sys.stderr)
        return temp_file.name
    except Exception as e:
        print(f"Error downloading video: {str(e)}", file=sys.stderr)
        raise

@mcp.tool()
def publish_video(video_url: str, title: str, description: str, category_id: str = "22", privacy_status: str = "private") -> dict:
    """
    Publish a video to YouTube from a URL.
    
    Args:
        video_url: URL of the video to publish
        title: Title of the video
        description: Description of the video
        category_id: YouTube category ID (default: 22 for People & Blogs)
        privacy_status: Privacy status (private, unlisted, or public)
    
    Returns:
        dict: The response from the YouTube API containing the video details
    """
    print(f"Publishing video from {video_url}...", file=sys.stderr)
    try:
        # Download the video
        video_path = download_video(video_url)
        
        # Get YouTube service
        youtube = get_youtube_service()
        
        # Prepare video metadata
        body = {
            'snippet': {
                'title': title,
                'description': description,
                'categoryId': category_id
            },
            'status': {
                'privacyStatus': privacy_status
            }
        }
        
        # Create media file upload object
        media = MediaFileUpload(
            video_path,
            mimetype=mimetypes.guess_type(video_path)[0],
            resumable=True
        )
        
        # Execute the upload
        request = youtube.videos().insert(
            part=",".join(body.keys()),
            body=body,
            media_body=media
        )
        
        # Upload the video
        response = request.execute()
        
        # Clean up the temporary file
        os.unlink(video_path)
        
        print(f"Video published successfully with ID: {response.get('id')}", file=sys.stderr)
        return response
    except Exception as e:
        print(f"Error publishing video: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    print("Starting MCP server...", file=sys.stderr)
    mcp.run() 