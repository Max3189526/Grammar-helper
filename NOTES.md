After each save point, push it to GitHub.
OpenAI model with “luna” in its name: gpt-5.6-luna
## Maybe Later
- Let the user choose a first language.
- Let the user pick a simpler or more detailed level.
- Guide off-topic questions back to grammar.
- Label sentence parts such as subject and verb.
- Show what changed when the user rewrites a sentence.
- Save grammar rules for review.
- Quiz the user on saved rules.
- Read example sentences aloud.

## How to run
`npm start`

## Vercel setup
- Vercel serves the files in `public/` and runs `api/grammar.js` as the small serverless AI endpoint.
- Add the environment variable `OPENAI_API_KEY` in Vercel Project Settings for Preview and Production.
- No other Vercel setting is needed for this project. Keep the project root as the Root Directory.
- The browser saves practice data in localStorage; it is not uploaded.

## What’s done
- Version 1 MVP UI and real OpenAI server connection are built.
- The key is read only from `.env`, and `.env` is ignored by Git.
- Practice sentences save in browser localStorage only.
- Saves on this computer only for now.
- The local page works, but the current OpenAI key was rejected; replace it in `.env` before using AI.
- The Vercel deployment shape is ready; the local server remains available with `npm start`.
- The AI key comes from the server-only `getKey()` helper, which asks MindDo for a temporary key and refreshes it when it expires or OpenAI rejects it.

## What’s next
- Test the four MVP features with student examples.
- Add a first-language option after the MVP is demonstrated.
