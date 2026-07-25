# Run the backend with the project virtual environment
$venv = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if (-Not (Test-Path $venv)) {
    Write-Error 'Virtual environment not found. Create it first with `python -m venv .venv`.'
    exit 1
}
& $venv -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload-dir $PSScriptRoot --reload-exclude $PSScriptRoot\.venv
