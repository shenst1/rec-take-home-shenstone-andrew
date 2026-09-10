# Rec Take Home

Parks & recreation registration system. City staff manage programs in **admin**; families browse and register in **web**.

## Requirements

- [Bun](https://bun.sh/) 1.3.13
- No external database. SQLite lives in `data/`.

## Start locally

```bash
bun install
bun run seed
bun run dev
```

| App | Audience | URL |
| --- | --- | --- |
| web | Families / consumers | http://localhost:3000 |
| admin | City parks & rec staff | http://localhost:3001 |

## Commands

```bash
bun run dev    # both Next.js apps
bun run seed   # create / reset the local SQLite database
bun run build  # production builds
```

## Structure

```text
admin/   City staff: classes, sections, release times
web/     Consumers: browse programs and register
data/    SQLite database and seed
```
