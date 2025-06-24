import sys
import os
import dotenv
import tempfile

from elevenlabs.client import ElevenLabs # Import ElevenLabs client
from elevenlabs import VoiceSettings # Import VoiceSettings (optional, for more control)
# from elevenlabs import play # Play is for testing, not needed in server tool

dotenv.load_dotenv() # Load environment variables from .env file

try:
    from mcp.server.fastmcp import FastMCP
    print("MCP imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Failed to import MCP: {e}", file=sys.stderr)
    sys.exit(1)

print("Starting Text Audio Server...", file=sys.stderr)

# Create an MCP server
mcp = FastMCP("Text Audio Server")

# Initialize the ElevenLabs client globally or within the tool if preferred
elevenlabs_api_key = os.environ.get("ELEVENLABS_API_KEY")

# Initialize client outside the tool to avoid re-initialization on every call
elevenlabs_client = None
if elevenlabs_api_key:
    try:
        elevenlabs_client = ElevenLabs(
            api_key=elevenlabs_api_key,
        )
        print("Eleven Labs client initialized successfully.", file=sys.stderr)
    except Exception as e:
         print(f"Error initializing Eleven Labs client: {str(e)}", file=sys.stderr)
else:
    print("Warning: ELEVENLABS_API_KEY not set. Eleven Labs tool will not work.", file=sys.stderr)


@mcp.tool()
def generate_audio(text: str) -> dict:
    """
    Converts text to speech using the Eleven Labs API and returns the path to the generated audio file.

    Args:
        text: The text to convert to speech.

    Returns:
        dict: A dictionary containing the path to the audio file or an error message.
    """
    print(f"Generating audio for text: {text[:50]}...", file=sys.stderr) # Print first 50 chars of text

    if not elevenlabs_client:
         return {"error": "Eleven Labs client not initialized. ELEVENLABS_API_KEY might be missing or invalid."}

    # --- Eleven Labs API Configuration --- (using the official library)
    try:
        # Calling the text_to_speech conversion API with detailed parameters
        # Using parameters from the user's example
        audio_stream = elevenlabs_client.text_to_speech.convert(
            text=text,
            voice_id="JBFqnCBsd6RMkjVDRZzb", # Voice ID from user's example
            model_id="eleven_multilingual_v2", # Model ID from user's example
            output_format="mp3_44100_128", # Output format from user's example
            # You can add voice_settings here for more control if needed:
            # voice_settings=VoiceSettings(
            #     stability=0.5,
            #     similarity_boost=0.5
            # ),
        )

        # Save the audio stream to a temporary file
        # Use delete=False so the file persists after this function returns
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        with open(temp_file.name, 'wb') as f:
            # The convert method returns an iterator, write chunks to file
            for chunk in audio_stream:
                if chunk:
                    f.write(chunk)

        audio_file_path = temp_file.name
        print(f"Audio generated successfully and saved to {audio_file_path}", file=sys.stderr)

        # --- Google Sheets Integration Placeholder ---
        # You would add code here to interact with your sheets_server.py
        # to store the audio_file_path or the audio content in Google Sheets.
        # This might involve calling a tool on the sheets_server.
        # Example (assuming sheets_server has an add_audio_link tool):
        # sheets_server_tool = mcp.get_tool("Sheets Server", "add_audio_link")
        # sheets_server_tool(sheet_name="YourSheet", row_id="some_id", audio_link=audio_file_path)
        # --- End Placeholder ---

        return {"audio_file_path": audio_file_path}

    except Exception as e:
        print(f"Error generating audio with Eleven Labs library: {str(e)}", file=sys.stderr)
        # Catch specific ElevenLabs library exceptions for more detail if needed
        return {"error": f"Eleven Labs audio generation error: {str(e)}"}

if __name__ == "__main__":
    print("Starting MCP server...", file=sys.stderr)
    # Ensure you have the necessary libraries installed:
    # uv pip install --system fastmcp python-dotenv elevenlabs
    mcp.run() 