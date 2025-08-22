"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function NavigationBar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Editor",
      link: "/editor",
    },
    {
      name: "Login",
      link: "/login",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={() => {}} />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <NavbarButton variant="secondary">Login</NavbarButton>
            </Link>
            <Link to="/editor">
              <NavbarButton variant="primary">Editor</NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton variant="secondary" className="w-full">
                  Login
                </NavbarButton>
              </Link>
              <Link to="/editor" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton variant="primary" className="w-full">
                  Editor
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
