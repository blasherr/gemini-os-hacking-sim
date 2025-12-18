# Project Setup Instructions - OS Hacking Simulation

## Status Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [ ] Scaffold the Project
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Project Overview
**Type**: Next.js 14 + TypeScript + Tailwind CSS + Firebase
**Purpose**: MacOS-style OS simulation with immersive hacking scenario game
**Deployment**: Vercel
**Database**: Firebase Firestore (Free tier - optimized for read/write limits)
**Duration**: ~20 minute scenario
**Multi-user**: Simultaneous users with separate sessions

## Key Features
- OS simulation (MacOS 2025 style)
- Hacking scenario with objectives
- Mini-games (password cracking, puzzles)
- Encrypted files and conversations
- Real-time admin/owner panel
- Session management and progress tracking
- Notification system
- Success code upon completion
- Audio and logo assets integration

## Technical Requirements
- Modular architecture for optimization
- Firebase session persistence
- Real-time user monitoring (admin)
- Owner controls: notifications, help, skip, mini-games, screamers
- Session reset capability
- Resume from last checkpoint
