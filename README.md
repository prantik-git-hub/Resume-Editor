# Resume Editor

A full-stack resume editing app with AI-powered enhancements. User can upload resume(.pdf or .docx) alongwith edit fields like names,summary,add education,add experience,add skills. After that users can save the file and download json and pdf files(not original pdf) of the edited resume.

---

 ## Folder Structure

- `frontend/`: React.js-based resume editor  
- `backend/`: FastAPI backend to enhance and store resume data

---

 ## Setup Instructions

 ## Frontend(React)
```bash 
cd frontend
npm install     **It will ask for accessing node_modules for smooth installation(click ok)**
npm start
        **If 'react-scripts' is not recognized as an internal or external command** then run and check first:
cd path\to\your\project\frontend    **example 'check your directory address in file explorer'**
       then run:
rm -r node_modules package-lock.json
npm install
        **If 'rm' is not recognized as an internal or external command,operable program or batch file**
     then run:
rmdir /s /q node_modules
del package-lock.json
        **For deleting node_modules and package-lock.json**
  then run:
npm install
npm install react-scripts --save  **Manually install react-scripts**
npm start
       **Again if 'react-scripts' is not recognized as an internal or external command,operable program or batch file.**
  then run:
npm install react-scripts@5.0.1 --save
npm start

       **You can now view resume-editor in the browser**

  Local:            http://localhost:3000
  On Your Network:  http://172.22.112.1:3000
```
##  Optional cleanup for later using run:
```bash
npm audit fix --force
```
      **Note: --force may introduce breaking changes**


---

## Backend (FastAPI)
```bash 
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```
## It will show this:
```pgsql
INFO:     Will watch for changes in these directories: ['Your directory address']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [9812] using StatReload        
INFO:     Started server process [23996]
INFO:     Waiting for application startup.
INFO:     Application startup complete.

```
---

## Features

1.AI-enhanced resume sections
2.Save and load resumes (JSON)
3.Export to PDF and JSON
4.Upload parsing simulation

---

## Tech Stack

1.Frontend: React
2.Backend: FastAPI
3.Styling: CSS
4.PDF Generator: jsPDF

---



