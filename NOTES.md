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

## What’s done
- Version 1 MVP UI and real OpenAI server connection are built.
- The key is read only from `.env`, and `.env` is ignored by Git.
- Practice sentences save in browser localStorage only.
- Saves on this computer only for now.
- The local page works, but the current OpenAI key was rejected; replace it in `.env` before using AI.

## What’s next
- Test the four MVP features with student examples.
- Add a first-language option after the MVP is demonstrated.
