# CS 349D Final Project
a11y: Browser Agent Observability

## To Run

### Backend

Create a new virtual environment and install all the proper packages:

```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Then, install Playwright:

```bash
playwright install chromium
```

Finally, run the backend server:

```bash
uvicorn app:app --reload
```

### Frontend

First, install all necessary dependencies:

```bash
npm install
```

You can now start the website:

```bash
npm run dev
```
