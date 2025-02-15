## To build

1. Ensure you have Python installed (version >= 3.13.2)
2. Set up virtual environment and Python interpreter in IDE
   1. [Setup Python SDK for Intellij](https://www.jetbrains.com/help/idea/configuring-python-sdk.html)
   2. [Setup Python SDK for Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial#_create-a-virtual-environment)
3. Install python requirements
```
pip install -r requirements.txt
```

## To setup local dev server
1. Ensure that /backend/.env file contains the below environment key-pair values. Comment/uncomment the respective sections for `local` / `cloud` MongoDB.
```
## local
# MONGODB_URL = mongodb://localhost:27017
# DB_NAME = testdatabase"

## cloud
MONGODB_URL = MONGODB_URL
DB_NAME = DB_NAME
```
2. Execute command to run dev server locally
```
fastapi dev
```

## Adding new dependencies in new commits
Note: Before committing, remember to:
1. Update the `requirements.txt` in this folder by doing:
```
pip freeze > requirements.txt
```
2. Ensure that the backend still works fine with the frontend.