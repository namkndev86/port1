"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/components/common/locale-provider";
import ThemeSwitcher from "@/components/common/theme-switcher";
import LanguageSwitcher from "@/components/common/language-switcher";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useTranslation();

  const navItems = [
    { name: t("common.nav.home"), path: "/" },
    { name: t("common.nav.portfolio"), path: "/portfolio" },
    { name: t("common.nav.blog"), path: "/blog" },
  ];

  const getHref = (path: string) => {
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12">
      <nav className="max-w-6xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        {/* Brand */}
        <Link
          href={getHref("/")}
          className="font-display font-bold text-xl tracking-tight flex items-center gap-2 group"
        >
          <span className="text-primary font-mono">&lt;</span>
          <span className="text-white group-hover:text-primary transition-colors">
            NAM.dev
          </span>
          <span className="text-primary font-mono">/&gt;</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 font-sans">
          {navItems.map((item) => {
            const itemHref = getHref(item.path);
            const isActive =
              pathname === itemHref ||
              (item.path !== "/" && pathname.startsWith(itemHref));
            return (
              <Link
                key={item.path}
                href={itemHref}
                className="relative px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 border-b-2 border-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* CTA Button & Switchers */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Link
            href={getHref("/portfolio#contact")}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-all duration-300 group"
          >
            {t("common.nav.connect")}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-primary transition-colors p-1 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-6 right-6 mt-4 p-6 glass rounded-2xl flex flex-col gap-4 shadow-2xl md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={getHref(item.path)}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium py-2 transition-colors ${
                  pathname === getHref(item.path)
                    ? "text-primary border-l-2 border-primary pl-3"
                    : "text-muted hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href={getHref("/portfolio#contact")}
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1"
            >
              {t("common.nav.connect")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Mobile Preference Panel */}
            <div className="flex items-center justify-between gap-4 mt-2 border-t border-card-border/40 pt-4">
              <span className="text-xs text-muted font-semibold tracking-wide uppercase">
                {t("common.common.submit") ? "Settings" : "Preferences"}
              </span>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
