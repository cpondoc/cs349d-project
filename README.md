# CS 349D Final Project
Browser Agent Observability

## To Run

### Backend

Create a new virtual environment and install all the proper packages:

```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 test.py
```

Then, install Playwright:

```bash
playwright install chromium
```

Finally, run the test file:

```bash
python3 test.py
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
