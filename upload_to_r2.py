import os
import boto3
import requests
from botocore.config import Config

# ─── Load .env ───────────────────────────────────────────────────────────────
with open(os.path.join(os.path.dirname(__file__), ".env")) as f:
    for line in f:
        if line.strip() and not line.startswith("#") and "=" in line:
            k, v = line.strip().split("=", 1)
            os.environ[k.strip()] = v.strip().strip('"').strip("'")

# ─── Config ──────────────────────────────────────────────────────────────────
R2_ACCOUNT_ID   = os.environ["R2_ACCOUNT_ID"]
R2_ACCESS_KEY   = os.environ["R2_ACCESS_KEY"]
R2_SECRET_KEY   = os.environ["R2_SECRET_KEY"]
R2_BUCKET       = os.environ.get("R2_BUCKET_NAME", "exam-pdfs")
GITHUB_TOKEN    = os.environ["GITHUB_TOKEN"]
GITHUB_REPO     = os.environ["GITHUB_REPO"]

# ─── PDF filenames in the GitHub release ────────────────────────────────────
PDF_FILES = [
    "biology_webp.pdf",
    "chemistry_webp.pdf",
    "physics_webp.pdf",
    "biology-fs-class-12.pdf",
    "chemistry-fs-class-12.pdf",
    "maths-fs-class-12.pdf",
    "physics-fs-class-12.pdf",
    "chemistry-fs-11.pdf",
    "physics-fs-11.pdf",
    "maths-fs-11.pdf",
]

# ─── R2 client (S3-compatible) ───────────────────────────────────────────────
r2 = boto3.client(
    "s3",
    endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    config=Config(signature_version="s3v4"),
    region_name="auto",
)


def get_github_asset_url(repo: str, token: str, filename: str) -> str | None:
    """Get the download URL for a named asset in the v1.0.0 release."""
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
    }
    resp = requests.get(
        f"https://api.github.com/repos/{repo}/releases/tags/v1.0.0",
        headers=headers,
    )
    if resp.status_code != 200:
        print(f"  ❌ Failed to fetch release info: {resp.status_code}")
        return None
    for asset in resp.json().get("assets", []):
        if asset["name"] == filename:
            return asset["id"]
    return None


def upload_pdf_to_r2(filename: str):
    """Stream a PDF from GitHub Release directly into R2."""
    print(f"\n📦 Processing: {filename}")

    # Check if already uploaded
    try:
        r2.head_object(Bucket=R2_BUCKET, Key=filename)
        print(f"  ✅ Already in R2, skipping.")
        return
    except Exception:
        pass

    # Get asset ID from GitHub
    asset_id = get_github_asset_url(GITHUB_REPO, GITHUB_TOKEN, filename)
    if not asset_id:
        print(f"  ❌ Asset not found in GitHub release: {filename}")
        return

    # Stream from GitHub
    dl_headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/octet-stream",
    }
    asset_url = f"https://api.github.com/repos/{GITHUB_REPO}/releases/assets/{asset_id}"

    print(f"  ⬇️  Streaming from GitHub...")
    with requests.get(asset_url, headers=dl_headers, stream=True) as resp:
        if resp.status_code != 200:
            print(f"  ❌ Download failed: {resp.status_code}")
            return

        total = int(resp.headers.get("Content-Length", 0))
        print(f"  📊 Size: {total/1024/1024:.1f} MB")

        # Upload directly to R2 via multipart
        r2.upload_fileobj(
            resp.raw,
            R2_BUCKET,
            filename,
            ExtraArgs={"ContentType": "application/pdf"},
        )

    print(f"  ✅ Uploaded to R2 successfully!")


if __name__ == "__main__":
    print("🚀 Uploading all PDFs to Cloudflare R2...")
    print(f"   Bucket: {R2_BUCKET}")
    print(f"   Account: {R2_ACCOUNT_ID[:8]}...")

    for pdf in PDF_FILES:
        upload_pdf_to_r2(pdf)

    print("\n🎉 All PDFs uploaded to R2!")
    print("\nFiles in R2 bucket:")
    resp = r2.list_objects_v2(Bucket=R2_BUCKET)
    for obj in resp.get("Contents", []):
        print(f"  - {obj['Key']} ({obj['Size']/1024/1024:.1f} MB)")
