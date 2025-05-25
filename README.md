# HarmonyBot

**HarmonyBot** is a family support AI system featuring intelligent robots designed to enhance communication, emotional well-being, and education at home. Our product line includes **Timi**, an AI-powered childcare companion, and **Harmony**, a robot designed to help resolve relationship issues between adults. This repository includes the frontend website, backend APIs, and integration logic with AI models and hardware.

---

## 🌟 Key Features

### 🤖 Timi – Your Childcare Companion
- Engages children in friendly, educational conversations.
- Detects emotional states using child psychology principles.
- Shares useful insights with parents via app and dashboard.

### 💬 Harmony – AI for Relationship Support
- Helps adults navigate emotional conversations.
- Offers constructive suggestions to improve communication.
- Tailored for elder care, couple therapy, and family dialogue.

---

## 🧱 Architecture Overview

```mermaid
graph TD
    subgraph Customer Side
        A[Hardware Robot (ESP32 + Mic + Speaker)]
        B[Mobile App]
        C[Frontend Website]
    end

    subgraph Core System
        D[Main Backend - API & Session Management]
        E[Database - User Data & Chat History]
        F[Custom AI Models - Timi & Harmony]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
