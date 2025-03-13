import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import * as migrations_raw from "../../drizzle/*.sql";
import * as path from "node:path";
import { sql } from "drizzle-orm";

const { default: migrationsArray, filenames } = migrations_raw;

const migration_array_raw = filenames.map((file_path, idx) => {
    const filename = path.basename(file_path);
    const migration_script = migrationsArray[idx].default as string;

    return [filename, migration_script] as const;
});

const migration_array_sorted = migration_array_raw.sort((a, b) => {
    const a_idx = parseInt(a[0].substring(0, 4));
    const b_idx = parseInt(b[0].substring(0, 4));
    return a_idx - b_idx;
});

export const migrations = migration_array_sorted as [string, string][];

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export const migrate = async () => {
    await db.execute(
        sql`create table if not exists migrations (name text, applied boolean);`,
    );

    await db.transaction(async tx => {
        for (const [name, script] of migrations) {
            const res = await db.execute(
                sql`select applied from "migrations" where "migrations"."name" = ${name}`,
            );
            const rows = res.rows as { applied: boolean }[];
            const already_applied = rows[0] ? rows[0].applied : false;

            if (already_applied) {
                continue;
            }

            console.log(`Applying ${name}`)
            await db.execute(script).catch(() => { tx.rollback(); })
            await db.execute(sql`insert into "migrations" ("name", "applied") values (${name}, ${true})`).catch(() => { tx.rollback(); });
        }
    })

};
