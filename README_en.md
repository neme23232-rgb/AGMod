<div align="center">
  <img src="icon.png" width="96" height="96" alt="AGMod Logo">
  <h1>AGMod</h1>
  <p><strong>Themes, custom colors, system typography, and 100% localization for Google Antigravity.</strong></p>
  <p>
    <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-8b5f68">
    <img alt="Google Antigravity" src="https://img.shields.io/badge/Antigravity-v2.24%2B-00f0ff">
    <img alt="Open source" src="https://img.shields.io/badge/open%20source-MIT-7b9b83">
    <img alt="No telemetry" src="https://img.shields.io/badge/telemetry-none-7b9b83">
    <img alt="Localization" src="https://img.shields.io/badge/languages-7%20supported-7b9b83">
  </p>
  <p>
    <a href="README.md">Русский</a> • <a href="README_en.md">English</a>
  </p>
</div>

## Overview

**AGMod** is an all-in-one modification suite for **Google Antigravity 2.0**, adding a complete theme engine, interactive color studio, Windows local font discovery, and full workspace localization.

The mod integrates directly into the Antigravity Settings dialog as a native tab. Everything operates locally on your machine, requires no administrator privileges, and transmits zero telemetry over the network.

## Features

- 🎨 **14 Handcrafted Themes** — From deep darks (*Catppuccin Mocha, Cyberpunk Neon, OLED Pure Black, Dracula, Tokyo Night, Nord*) to bright lights (*GitHub Light, Catppuccin Latte*) with auto-contrast text adaptation.
- 🛠️ **Custom Theme Studio** — Tune accent, background, sidebar, and cards with live `preview.ts` syntax styling.
- 🔤 **PC System Fonts** — Automatically detects local Windows fonts via `queryLocalFonts` and supports direct font file uploads (`.woff2`, `.ttf`, `.otf`).
- 🌐 **100% Localization** — Complete translation across the entire workspace (Settings, chat, diffs, terminal, menus, and agent actions). 7 languages: Russian (1700+ phrases), Ukrainian (1700+ phrases), English, German, French, Spanish, and Chinese.
- 🗜️ **Deep High-Density Mode** — 220px slim sidebar and minimized padding for optimal coding viewport.
- 💾 **Triple Persistence** — Changes are backed synchronously to disk (`agmod_settings.json`), app storage, and `localStorage`.

## Quick Start

1. Close **Google Antigravity** if running.
2. Download or clone this repository.
3. Run **`install.bat`** (or execute `node install.js`).
4. Launch Google Antigravity, open **Settings** (gear icon), and select the **AGMod** tab.

> [!TIP]
> The installer automatically creates an untouched backup of the official bundle (`app.asar.backup`), allowing instant 1-click restoration anytime.

## Uninstallation

To completely uninstall AGMod and restore the original bundle:
1. Run **`uninstall.bat`** (or `node uninstall.js`).
2. Launch Antigravity — the application will be restored to its default state.

---

<div align="center">
  <sub>Developed for the Google Antigravity Community. MIT License.</sub>
</div>
