# grammalecte-ts

A TypeScript wrapper library around the Python Grammalecte French grammar API.

## Installation

```bash
bun install grammalecte-ts
```

## Usage

The wrapper exposes five main functions:

### 1. `checkGrammar(text, cookies?)`

Analyze text for grammar errors.

```typescript
import { checkGrammar } from "grammalecte-ts";

const result = await checkGrammar("Ceci est un teste.");
// {
//   data: [
//     {
//       nStart: 12,
//       nEnd: 17,
//       sRuleId: "rule_id",
//       sMessage: "Error message",
//       aSuggestions: ["test"],
//       ...
//     }
//   ],
//   error: ""
// }
```

### 2. `getOptions(cookies?)`

Get available grammar options for the current user session.

```typescript
import { getOptions } from "grammalecte-ts";

const options = await getOptions();
// { option1: true, option2: false, ... }
```

### 3. `setOptions(options, cookies?)`

Set grammar options for the current user session.

```typescript
import { setOptions } from "grammalecte-ts";

const updated = await setOptions({ option1: true, option2: false });
// { option1: true, option2: false, ... }
```

### 4. `resetOptions(cookies?)`

Reset user options to defaults.

```typescript
import { resetOptions } from "grammalecte-ts";

await resetOptions();
```

### 5. `getSpellingSuggestions(word, cookies?)`

Get spelling suggestions for a word.

```typescript
import { getSpellingSuggestions } from "grammalecte-ts";

const suggestions = await getSpellingSuggestions("teste");
// ["test", "tester", "tests", ...]
```

## Session Management

All functions accept an optional `cookies` parameter. Pass the `Cookie` header value to maintain user sessions:

```typescript
const cookies = "grammalecte_session=xyz123";
const result = await checkGrammar("Your text", cookies);
```

## Configuration

The wrapper connects to the Grammalecte API at:

- **Environment variable**: `GRAMMALECTE_URL` (required)

Example:
```bash
export GRAMMALECTE_URL=http://localhost:8080
```

## Running with Docker Compose

A docker-compose setup is included to run the Python Grammalecte server:

```bash
docker-compose up
```

This starts the Grammalecte Python service on port 8080.

## Development

Install dependencies:

```bash
bun install
```

Build the package:

```bash
bun run build
```
Run tests:

```bash
bun test
```

Watch mode:

```bash
bun run dev
```

Type checking:

```bash
bun run typecheck
```

Linting:

```bash
bun run lint
bun run lint:fix
```

Formatting:

```bash
bun run fmt
bun run fmt:check
```

## Type Definitions

TypeScript types are exported for all API responses:

```typescript
import type {
  GrammarCheckResult,
  GrammarCheckResponse,
  GrammarError,
  GrammarOptions,
} from "grammalecte-ts";
```

## License

MIT