# How to Deploy to Netlify

There are two easy ways to deploy your Routine Tracker app to Netlify.

## Option 1: Drag & Drop (Manual)

1.  **Build the Project**:
    Open your terminal in the `frontend` directory and run:
    ```bash
    npm run build
    ```
    This will create a `dist` folder in your project.

2.  **Deploy**:
    *   Go to [app.netlify.com](https://app.netlify.com) and log in.
    *   Navigate to the "Sites" tab.
    *   Drag and drop the `dist` folder onto the area that says "Drag and drop your site folder here".

## Option 2: Git Integration (Recommended for continuous updates)

1.  **Push to GitHub**:
    Ensure your latest code is pushed to your GitHub repository.

2.  **Connect to Netlify**:
    *   Log in to Netlify.
    *   Click "Add new site" -> "Import from existing project".
    *   Select **GitHub**.
    *   Pick your `Routine_Tracker` repository.

3.  **Configure Build Settings**:
    Netlify should detect these automatically, but double-check:
    *   **Base directory**: `frontend`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`

4.  **Deploy**:
    Click "Deploy Team". Netlify will build your site and give you a URL.
