<div align="center">
  <img src="icon.png" width="96" height="96" alt="AGMod Logo">
  <h1>AGMod</h1>
  <p><strong>Themes, custom colors, system typography, and localization for Google Antigravity.</strong></p>
  <p>
    <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-8b5f68">
    <img alt="Antigravity" src="https://img.shields.io/badge/Antigravity-v2.24%2B-557a95">
    <img alt="Open source" src="https://img.shields.io/badge/open%20source-MIT-7b9b83">
    <img alt="No telemetry" src="https://img.shields.io/badge/telemetry-none-7b9b83">
    <img alt="Languages" src="https://img.shields.io/badge/localization-7%20languages-557a95">
  </p>
  <p>
    <a href="README.md">Русский</a> • <a href="README_en.md">English</a>
  </p>
</div>

## Overview

AGMod extends Google Antigravity with a built-in theme engine, custom interface color editor, system typography support, and complete workspace localization.

The modification integrates into the application as a dedicated tab inside the settings dialog. Everything runs locally on your machine, requires no administrator rights, and sends no network data.

## Features

- **14 Themes** — Dark and light presets (Catppuccin Mocha, GitHub Light, Catppuccin Latte, Dracula, Nord, OLED Pure Black, and more) with automatic text contrast adjustment.
- **Color Studio** — Fine-tune accent, background, sidebar, and cards with real-time syntax preview.
- **Typography** — Discover installed Windows fonts and upload local font files (.woff2, .woff, .ttf, .otf).
- **Localization** — Full translation across interface, settings, dialogs, and actions. 7 languages supported: Russian (1700+ phrases), Ukrainian (1700+ phrases), English, German, French, Spanish, and Chinese.
- **Compact Mode** — Reduces sidebar width to 220px and minimizes padding to maximize editing space.
- **Persistent Storage** — Settings are saved locally to `agmod_settings.json` and persist across application restarts.

## Quick Start

1. Close Google Antigravity if the application is running.
2. Download or clone this repository.
3. Run `install.bat` (or execute `node install.js`).
4. Launch Google Antigravity, open **Settings** (gear icon), and select the **AGMod** tab.

The installer creates a backup of the original bundle (`app.asar.backup`) before applying modifications.

## Requirements

- Windows 10 or 11 (64-bit).
- Google Antigravity v2.23, v2.24 or newer.
- Node.js (when installing via command line).

## Uninstallation

1. Run `uninstall.bat` (or execute `node uninstall.js`).
2. Launch Google Antigravity — the application will return to its original state.
