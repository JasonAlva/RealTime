import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EditorPage from "./pages/EditorPage";
import { NavigationBar } from "./components/NavigationBar";

function App() {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 my-4">
        <div className="min-h-screen bg-gray-100 text-gray-900">
          <NavigationBar />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/editor" element={<EditorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
