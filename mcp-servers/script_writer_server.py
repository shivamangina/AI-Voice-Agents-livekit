import sys
import os
import requests # Import the requests library
import dotenv # Import the dotenv library

dotenv.load_dotenv() # Load environment variables from .env file

try:
    from mcp.server.fastmcp import FastMCP
    print("MCP imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Failed to import MCP: {e}", file=sys.stderr)
    sys.exit(1)

# Import necessary libraries for Perplexity API interaction (you'll need to install them)
# import requests # Example if using requests

print("Starting Script Writer Server...", file=sys.stderr)

# Create an MCP server
mcp = FastMCP("Script Writer Server")

@mcp.tool()
def write_script(theme: str, criteria: str) -> dict:
    """
    Generates a movie script based on the provided theme and criteria using Perplexity AI.

    Args:
        theme: The main theme of the script (e.g., "horror with clowns").
        criteria: Additional criteria for the script (e.g., "set in tripura", "10 seconds long").

    Returns:
        dict: A dictionary containing the generated script or an error message.
    """
    print(f"Generating script for theme: {theme} with criteria: {criteria}", file=sys.stderr)

    # --- Placeholder for Perplexity API Integration ---
    # You need to add code here to call the Perplexity API.
    # 1. Construct the prompt using the theme and criteria.
    # 2. Make an API call to Perplexity (e.g., using the 'requests' library).
    # 3. Process the API response to extract the generated script.
    # 4. Handle potential API errors.
    
    try:
        # Example prompt construction (adjust as needed for the API)
        prompt = f"Write a short movie script (around 10 seconds) based on the theme '{theme}' with the following criteria: {criteria}. Focus on dialogue and scene descriptions suitable for storyboarding."
        
        # Replace this comment block with your actual API call code.
        # Example using a hypothetical function:
        pplx_api_key = os.environ.get("PPLX_API_KEY") # Store your API key securely
        if not pplx_api_key:
            raise ValueError("PPLX_API_KEY environment variable not set.")
        
        api_url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {pplx_api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "sonar-pro", # Or "sonar-small-chat"
            "messages": [
                {"role": "system", "content": "You are a scriptwriter generating short movie scripts."}, # System message for context
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500, # Adjust based on expected script length
            "temperature": 0.7 # Adjust for creativity
        }
        
        response = requests.post(api_url, headers=headers, json=data)
        response.raise_for_status() # Raise an exception for bad status codes
        
        result = response.json()
        # Adjust the path based on the actual API response structure for chat completions
        generated_script = result["choices"][0]["message"]["content"] 

        # --- End Placeholder ---

        # For now, returning a dummy response
        # generated_script = f"## Script for '{theme}'\n\nScene 1:\n[Description based on criteria: {criteria}]\nCharacter A: Line 1\nCharacter B: Line 2\n\nScene 2:\n[More description]\nCharacter A: Line 3\n\n(This is a placeholder script. Integrate Perplexity API here.)"

        print("Script generated successfully (placeholder).", file=sys.stderr)
        return {"script": generated_script}

    except Exception as e:
        print(f"Error generating script: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    print("Starting MCP server...", file=sys.stderr)
    # You might need to install MCP first:
    # uv pip install --system fastmcp
    mcp.run() 