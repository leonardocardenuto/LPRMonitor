import React from "react";

export default function App() {
    return (
      <div className="min-h-screen max-h-full bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="text-xl font-bold">Meu App</div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Home</a>

          </div>
        </nav>
  
        <main className="p-6">
          <h1 className="text-2xl font-semibold">Bem-vindo ao aplicativo!</h1>
        </main>
      </div>
    );
  }
  