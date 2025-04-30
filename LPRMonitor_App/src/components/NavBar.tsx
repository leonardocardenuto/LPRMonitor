import React, { useState } from 'react';

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Botão hambúrguer */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Texto central */}
        <h1 className="text-lg font-semibold mx-auto lg:mx-0">Minha Aplicação</h1>

        {/* Menu Desktop (escondido em mobile) */}
        <nav className="hidden lg:flex gap-4">
          <a href="#" className="hover:underline">Item 1</a>
          <a href="#" className="hover:underline">Item 2</a>
          <a href="#" className="hover:underline">Item 3</a>
        </nav>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="lg:hidden mt-2 space-y-2 text-center">
          <a href="#" className="block">Item 1</a>
          <a href="#" className="block">Item 2</a>
          <a href="#" className="block">Item 3</a>
        </div>
      )}
    </header>
  );
};

export default NavBar;
