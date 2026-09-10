# Rec Take Home

Parks & recreation registration system. City staff manage programs in **admin**; families browse and register in **web**.

## Requirements

- Node.js 22+
- [pnpm](https://pnpm.io/) 10
- No external database. SQLite lives in `packages/data`.

## Start locally

```bash
pnpm install
pnpm db:migrate
pnpm seed
pnpm dev
```

| App | Audience | URL |
| --- | --- | --- |
| web | Families / consumers | http://localhost:3000 |
| admin | City parks & rec staff | http://localhost:3001 |

## Commands

```bash
pnpm dev         # both Next.js apps via Turborepo
pnpm db:migrate  # create / apply Prisma migrations
pnpm db:generate # regenerate Prisma Client
pnpm db:studio   # inspect SQLite in Prisma Studio
pnpm seed        # reset and populate local data
pnpm build       # production builds
```

Both apps import a shared Prisma client from `@rec/data`. The SQLite file is `packages/data/rec.db`.

## Structure

```text
apps/admin          City staff: classes, sections, release times
apps/web            Consumers: browse programs and register
packages/data       Prisma schema, migrations, seed, and SQLite file
```
