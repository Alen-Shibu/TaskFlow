# AI Tools Log

This document honestly records how AI tools were used during the development of this project.

---

## Tools Used

### 1. Claude (Anthropic)
**Used for:** Frontend UI development + all project documentation
- Generating Next.js page layouts (Login, Register, Task Dashboard)
- Styling components and structuring the UI
- Writing reusable React components
- Reviewed all generated code, adjusted props, state logic, and API integration to fit the actual backend
- Drafting `ARCHITECTURE.md` — sections were reviewed and modified to accurately reflect my actual implementation decisions
- Drafting `README.md` — setup steps were verified and corrected to match the real project structure
- Drafting `AI_LOG.md` and `.env.example` — adjusted to match actual tools used and real environment variables
- All documents were edited after generation to reflect what I actually built, not a generic template

### 2. ChatGPT (OpenAI)
**Used for:** Brainstorming and planning
- Discussing overall architecture before writing any code
- Thinking through the JWT auth flow (register → login → token → protected route)
- Exploring folder structure options for NestJS and Next.js
- All suggestions were evaluated and adapted — not used verbatim

### 3. GitHub Copilot
**Used for:** Debugging
- Inline suggestions while tracking down bugs in NestJS guards and Mongoose queries
- Helped identify issues in middleware and validation logic
- All accepted suggestions were read and understood before keeping them

---

## Honest Notes

- UI code was largely AI-assisted (Claude), but I reviewed every component and understand how each one works
- Architecture decisions were my own, informed by ChatGPT brainstorming sessions
- I can explain every part of this codebase in plain language