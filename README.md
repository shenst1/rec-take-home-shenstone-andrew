# Rec Take Home

Parks & recreation registration system. City staff manage programs in **admin**; families browse and register in **web**.

## Requirements

- Node.js 22+
- [pnpm](https://pnpm.io/) 10
- No external database. SQLite lives in `packages/data`.

## Start locally

```bash
pnpm install
pnpm seed
pnpm dev
```

| App | Audience | URL |
| --- | --- | --- |
| web | Families / consumers | http://localhost:3000 |
| admin | City parks & rec staff | http://localhost:3001 |

## Commands

```bash
pnpm dev    # both Next.js apps via Turborepo
pnpm seed   # create the local SQLite database
pnpm build  # production builds
```

## Structure

```text
apps/admin      City staff: classes, sections, release times
apps/web        Consumers: browse programs and register
packages/data   SQLite database and seed
```
