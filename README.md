# grammalecte-web

This project is a TS wrapper around the Python grammalecte API.

To install dependencies:

```bash
bun install
```

This project was created using `bun init` in bun v1.3.7. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

# Development

In a first terminal, run `docker run --rm -p 8080:8080 --name gr grammalecte:latest` 
In a second one, run `bun run index.ts`