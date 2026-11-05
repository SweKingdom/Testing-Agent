# User manual

## Getting started

Table of contents: Getting started

## Getting started
This chapter covers setting up the project on a development machine. It is for developers and operators, not for end users of the kudos features, which are added in later stories.

1. Install Node.js 22 or later.
2. In the repository folder, run `npm install`.
3. Copy `.env.example` to `.env` and adjust the values if needed:
   - `PORT`: port the API listens on (default `3000`).
   - `DATA_FILE`: path to the data file (default `data/kudos.json`).

Tip: `.env` is private to your machine and is never committed to git.
