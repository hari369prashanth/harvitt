"use client";

import { useState } from "react";
import Menu from "@/components/Menu"; // Client-side menu

const MobileMenuToggle = ({ role }: { role: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false); // Close the menu
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Visible only on mobile screens */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-4 text-white text-2xl fixed top-4 left-4 z-10"
      >
        ☰ {/* Hamburger icon for mobile menu */}
      </button>

      {/* Mobile Menu - Visible only on mobile screens */}
      <div
        className={`fixed md:hidden w-[75%] h-full bg-gradient-to-br from-[#0d1117] to-[#1f2937] p-6 transform transition-transform duration-300 z-20 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✖ {/* Close icon */}
        </button>
        <div className="mt-10">
          {/* Render the client-side menu and pass the role and closeMenu function */}
          <Menu role={role} closeMenu={closeMenu} />
        </div>
      </div>
    </>
  );
};

export default MobileMenuToggle;
