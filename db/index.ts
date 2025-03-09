import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

import { usersTable } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Insert a new user
  const newUser = await db
    .insert(usersTable)
    .values({
      stack_auth_id: 'some_unique_id',
      name: 'John',
      age: 30,
      email: 'john@example.com',
    })
    .returning();

  console.log('Inserted user:', newUser);

  // Update user age by email
  await db
    .update(usersTable)
    .set({ age: 31 })
    .where(eq(usersTable.email, newUser[0].email));
  console.log('User info updated!');

  // Fetch updated user
  const updatedUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, newUser[0].email));
  console.log('Updated user:', updatedUser);

  // Delete user
  await db.delete(usersTable).where(eq(usersTable.email, newUser[0].email));
  console.log('User deleted!');
}

main().catch(console.error);
