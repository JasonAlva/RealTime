# RealTime
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/JasonAlva/RealTime)

RealTime is an AI-enhanced collaborative coding platform designed for seamless real-time teamwork. It provides a shared Monaco Editor environment, live cursor tracking, code execution, and an integrated chat, all powered by a Node.js backend and a React frontend.

## Features

*   **Real-time Collaborative Editor**: Multiple users can edit the same file simultaneously, with changes reflected instantly for everyone.
*   **Live Cursors & Selections**: See your teammates' cursors and text selections in real-time, each distinguished by a unique color.
*   **Multi-Language Support**: Write and execute code in various languages, including JavaScript, Python, Java, C++, and more, with syntax highlighting.
*   **Code Execution**: Run your code against the Judge0 API and view the output directly within the editor's console.
*   **Integrated Team Chat**: Communicate with your team without leaving the editor using the built-in chat panel.
*   **User Authentication**: Secure login with Google OAuth powered by Supabase, with support for anonymous guest users.
*   **File Management**: A simple tab-based system to create and manage multiple files within a session.
*   **Customizable UI**: Choose between light, dark, and high-contrast editor themes to suit your preference.
*   **Invite System**: Generate a unique token to invite others to join your coding session.
*   **Responsive Design**: A modern, responsive UI built with shadcn/ui and Tailwind CSS that works on both desktop and mobile devices.

## Tech Stack

-   **Frontend**:
    -   React & TypeScript
    -   Vite
    -   Monaco Editor
    -   Socket.IO Client
    -   Supabase (for Authentication)
    -   Tailwind CSS
    -   shadcn/ui
-   **Backend**:
    -   Node.js & Express
    -   TypeScript
    -   Socket.IO
    -   Judge0 API (for code execution)
    -   dotenv

## Getting Started

To run this project locally, you will need to set up both the server and the client.

### Prerequisites

-   Node.js (v18 or later)
-   npm, pnpm, or yarn
-   A RapidAPI account with a subscription to the [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)
-   A [Supabase](https://supabase.com/) project

### Backend Setup (`/server`)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add your RapidAPI key:
    ```env
    RAPIDAPI_KEY=your_rapidapi_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The backend server will be running on `http://localhost:8080`.

### Frontend Setup (`/client`)

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `client` directory and add your Supabase project credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Start the development client:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## Usage

-   Open your browser and navigate to `http://localhost:5173`.
-   You can use the platform as a guest or sign in with your Google account via the Login page.
-   Navigate to the `/editor` page to start coding.
-   Select your desired programming language from the dropdown menu.
-   Write code in the editor. Your changes and cursor position will be broadcast to other users in the same room.
-   Use the **Run** button to execute your code. Input can be provided in the "Input" text area, and results will appear in the "Output" area.
-   Communicate with your team using the **Chat** tab.
-   Click the **Invite** button to generate a token to share with others.
