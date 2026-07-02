"use client";

import Link from "next/link";

import { useTranslation } from "@/components/common/locale-provider";
import {
  GithubIcon as Github,
  LinkedinIcon as Linkedin,
  TwitterIcon as Twitter,
} from "@/components/ui/social-icons";

export default function Footer() {
  const { t, locale } = useTranslation();

  const getHref = (path: string) => {
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <footer className="w-full bg-card border-t border-card-border px-6 py-12 md:px-12 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            href={getHref("/")}
            className="font-display font-bold text-lg tracking-tight flex items-center gap-1.5"
          >
            <span className="text-primary font-mono">&lt;</span>
            <span className="text-foreground">NAM.dev</span>
            <span className="text-primary font-mono">/&gt;</span>
          </Link>
          <p className="text-sm text-muted text-center md:text-left max-w-xs">
            {t("common.footer.tagline")}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/namkndev86/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white hover:border-primary transition-all duration-300"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/namkndev86/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white hover:border-primary transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/namkndev86"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white hover:border-primary transition-all duration-300"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright & Scroll To Top */}
        <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted">
          <span>
            &copy; {new Date().getFullYear()} Nguyen Khac Nam.{" "}
            {t("common.footer.rights")}
          </span>
          <span className="text-xs">{t("common.footer.tech")}</span>
        </div>
      </div>
    </footer>
  );
}
