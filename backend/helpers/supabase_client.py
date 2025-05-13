import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Supabase credentials are not set in the environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def upload_to_reports_bucket(local_file_path: str, dest_file_name: str = None, bucket: str = "reports", query: str = None):
    """
    Uploads a file to the specified Supabase storage bucket and logs the upload.
    If a file with the same name exists, it will be overwritten.
    
    Args:
        local_file_path: Path to the local file to upload
        dest_file_name: Name to give the file in the bucket (defaults to local filename)
        bucket: Name of the bucket to upload to (defaults to "reports")
        query: The query/task that generated this report (optional)
    """
    if dest_file_name is None:
        dest_file_name = os.path.basename(local_file_path)
    
    try:
        # First try to remove the file if it exists
        try:
            supabase.storage.from_(bucket).remove([dest_file_name])
        except Exception:
            # File might not exist, which is fine
            pass
            
        # Upload the new file
        with open(local_file_path, "rb") as f:
            res = supabase.storage.from_(bucket).upload(dest_file_name, f)
            
        # Insert into logs table
        supabase.table('logs').insert({
            'query': query or 'No query provided',
            'file': dest_file_name
        }).execute()
            
        return res
    except Exception as e:
        print(f"Error during Supabase operation: {str(e)}")
        raise 