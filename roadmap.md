# AutoIllustrator Roadmap

## Overview
AutoIllustrator is a command-line interface (CLI) tool designed to control a local instance of Adobe Illustrator using natural language prompts. It leverages an LLM to translate user instructions into executable Adobe Illustrator scripts (ExtendScript / JSX) and runs them automatically.

## Architecture Context
The tool will run natively on Windows (via PowerShell/Node.js), avoiding WSL cross-platform complexity.

1. **CLI App (Windows Node.js/PowerShell):** Takes your prompt and talks to the LLM.
2. **LLM (Venice API):** Generates Adobe ExtendScript (`.jsx`).
3. **Execution Bridge:** The app invokes Illustrator directly via COM automation or command line to execute the `.jsx` file.

## Phase 1: Foundation (Windows Native Scripting)
- [ ] **Illustrator Scripting Basics:** Write a simple "Hello World" ExtendScript (e.g., draw a 100x100 rectangle) manually.
- [ ] **Execution Automation:** Verify we can execute the `.jsx` script in Illustrator directly from PowerShell using either `illustrator.exe` command-line arguments or an OLE/COM object.

## Phase 2: LLM Integration (Venice API)
- [ ] **Choose the Stack:** Initialize a Node.js CLI project.
- [ ] **LLM Setup:** Integrate the Venice API (defaulting to the `glm 5.1` model).
- [ ] **System Prompt Engineering:** Craft a highly specific system prompt that teaches the LLM how to write valid ExtendScript for Illustrator. Provide examples of common tasks (creating shapes, changing colors, manipulating layers).

## Phase 3: The Execution Loop
- [ ] **Core Loop:** User prompt -> Venice API generates `.jsx` -> save to temp file -> execute natively.
- [ ] **Error Handling:** Implement basic error catching.

## Phase 4: Advanced Features
- [ ] **Self-Healing:** Capture execution errors and feed them back to the LLM for correction.
- [ ] **Context Awareness:** Dump current Illustrator document state to JSON to provide context to the LLM.