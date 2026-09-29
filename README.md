# Virtual Cryptography Laboratory — Module 05: Bcrypt Password Hashing

A complete, self-contained interactive web-based Virtual Cryptography Laboratory single-page module for learning, experimenting with, and analyzing the **Bcrypt Password Hashing Algorithm**.

---

## 📌 Module Overview

This web module is built using **HTML5**, **Vanilla CSS3 (Dark Cyber Theme)**, and **Vanilla JavaScript (ES6+)**. It operates as a clean **Single Page Application (SPA)** where all sections reside in `index.html` with smooth-scrolling header navigation and client-side execution.

---

## 📁 File Directory

```
c:\Users\SHWET\OneDrive\Desktop\Bcrypt\
├── index.html       # Single-Page Layout (Aim, Theory, Procedure, Pipeline, Experiment Workbench, Quiz, References)
├── style.css        # CSS3 Modern Dark Cyber Theme & Glassmorphism Design System
├── script.js        # Client-side Bcrypt Logic & Dynamic UI Engine
└── README.md        # Comprehensive Module Documentation & Test Cases
```

---

## 🚀 Key Features & Learning Tools

1. **Aim & Objectives (`#aim`)**:
   - High-level overview of module learning goals and cryptographic concepts.

2. **Comprehensive Theory & Concepts (`#theory`)**:
   - One-way Cryptographic Hashing vs. Two-way Encryption.
   - Flaws of fast hash functions (MD5, SHA-256) against GPU/ASIC rainbow table attacks.
   - Purpose of 128-bit random CSPRNG salts.
   - Modular Bcrypt hash structure (`$identifier$cost$salt+digest`).
   - The $2^{\text{cost}}$ work factor formula.
   - The **72-byte password length limitation** of Eksblowfish and SHA-256 pre-hashing workarounds.

3. **Step-by-Step Procedure (`#procedure`)**:
   - Clear numbered steps guiding students through hashing, verification, salt testing, and quiz evaluation.

4. **Interactive Password-to-Hash Visualizer Pipeline (`#pipeline`)**:
   - 5-stage animated visualizer breaking down input validation, salt generation, key stretching, 64-round Blowfish encryption, and modular formatting.

5. **Experiment Workbench (`#experiment`)**:
   - **Bcrypt Hash Generator**: Interactive cost selection (4 to 12), live millisecond timing via `performance.now()`, real-time UTF-8 byte counter, and 72-byte warning bar.
   - **Password Match Verifier**: Verifies candidate passwords against target hashes with visual feedback.
   - **Random Salt Demonstration**: Hashes the exact same password 3 times to visually prove non-deterministic hash generation, then verifies all 3 against the password.
   - **Modular Hash Inspector**: Disassembles any 60-character Bcrypt hash into Version ($2b$), Cost Factor, Salt (22 chars / 128 bits), and Digest (31 chars / 192 bits).

6. **Self-Assessment Quiz (`#quiz`)**:
   - Interactive multiple-choice quiz with automatic scoring, instant option feedback, and detailed explanations.

7. **Academic References & Feedback (`#references`)**:
   - Academic paper citations (Provos & Mazières 1999, Schneier 1994 Blowfish) and OWASP cheat sheet links.
   - Interactive star rating and student feedback form.

---

## 🧪 Test Cases & Expected Outputs

| Test Case ID | Section | Feature / Component | Input Data | Expected Output | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Workbench | Hash Generation | Password: `Crypt@2026Lab`<br>Cost: `10` | 60-character string starting with `$2b$10$` | Execution time measured (> 0 ms); length = 60; rounds = 1,024. |
| **TC-02** | Workbench | 72-Byte Warning Banner | 75 ASCII characters | Progress bar turns red; warning banner appears indicating silent truncation after byte 72. | UI warning displayed; input handled safely. |
| **TC-03** | Workbench | Password Verification (Pass) | Candidate: `Crypt@2026Lab`<br>Target: Hash from TC-01 | Green banner: `✅ MATCH SUCCESSFUL!` | `bcrypt.compareSync` returns `true`. |
| **TC-04** | Workbench | Password Verification (Fail) | Candidate: `WrongPass123`<br>Target: Hash from TC-01 | Red banner: `❌ MATCH FAILED!` | `bcrypt.compareSync` returns `false`. |
| **TC-05** | Workbench | Random Salt Non-Determinism | Password: `SameSecretPassword123`<br>Click "Generate 3 Hashes" | 3 completely distinct hash strings generated side-by-side. | Extracted salts differ; verifying all 3 against `SameSecretPassword123` returns `true`. |
| **TC-06** | Workbench | Modular Format Inspector | Input: `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` | Version: `$2b$`<br>Cost: `10` (1,024 rounds)<br>Salt: `N9qo8uLOickgx...` (22 chars)<br>Digest: `IjZAgcfl...` (31 chars) | Correct segment breakdown and length indicators. |
| **TC-07** | Pipeline | Pipeline Visualizer | Click "Next Step" through to Step 5 | Progress bar updates from Step 1 to Step 5 with animated descriptions. | Stage counter updates to `Step 5 of 5`. |
| **TC-08** | Quiz | Quiz Scoring | Select answers on Questions 1 to 5 | Instant green/red option feedback; score updates on top badge. | Explanations displayed per question. |

---

## 🌐 External Dependencies

1. **Bcrypt.js**: `https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js`
2. **Font Awesome 6.4.0**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
3. **Google Fonts**: `Inter` & `Fira Code`
