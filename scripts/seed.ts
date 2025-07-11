import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, posts, comments } from '../src/db/schema';
import { hashPassword } from '../src/server/auth';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo user
    const demoPasswordHash = await hashPassword('password123');
    
    const [demoUser] = await db.insert(users).values({
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      role: 'admin',
      bio: 'Demo user for testing the PPR authentication system',
    }).returning();

    // Create more users
    const [user1] = await db.insert(users).values({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: await hashPassword('password123'),
      role: 'user',
      bio: 'Full-stack developer passionate about modern web technologies',
    }).returning();

    const [user2] = await db.insert(users).values({
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: await hashPassword('password123'),
      role: 'user',
      bio: 'UI/UX Designer with a love for creating beautiful user experiences',
    }).returning();

    const [user3] = await db.insert(users).values({
      name: 'Bob Johnson',
      email: 'bob@example.com',
      passwordHash: await hashPassword('password123'),
      role: 'user',
      bio: 'Data Scientist exploring the intersection of AI and web development',
    }).returning();

    console.log('✅ Users created');

    // Create sample posts
    const samplePosts = [
      {
        title: 'Getting Started with Next.js PPR',
        content: 'Partial Pre-rendering is a game-changer for performance. In this post, we explore how to implement PPR with tRPC and TanStack Query for optimal user experience.',
        authorId: demoUser.id,
        likes: 24,
        views: 156,
      },
      {
        title: 'Advanced tRPC Patterns',
        content: 'Learn how to implement complex data fetching patterns with tRPC. We cover server-side prefetching, error handling, and optimistic updates.',
        authorId: user1.id,
        likes: 18,
        views: 89,
      },
      {
        title: 'React Server Components Deep Dive',
        content: 'Understanding the benefits of server-side rendering with React Server Components. We explore the architecture and implementation details.',
        authorId: user2.id,
        likes: 31,
        views: 203,
      },
      {
        title: 'Building Scalable Applications',
        content: 'Best practices for enterprise-level React applications. We cover state management, routing, testing, and deployment strategies.',
        authorId: user1.id,
        likes: 42,
        views: 278,
      },
      {
        title: 'Error Boundaries and Suspense',
        content: 'Proper error handling in modern React applications. Learn how to implement error boundaries and suspense for better user experience.',
        authorId: user3.id,
        likes: 15,
        views: 67,
      },
    ];

    const createdPosts = await db.insert(posts).values(samplePosts).returning();
    console.log('✅ Posts created');

    // Create sample comments
    const sampleComments = [
      {
        content: 'Great post! This really helped me understand PPR better.',
        postId: createdPosts[0].id,
        authorId: user1.id,
      },
      {
        content: 'Very informative, thanks for sharing!',
        postId: createdPosts[0].id,
        authorId: user2.id,
      },
      {
        content: 'Looking forward to implementing this in my project.',
        postId: createdPosts[1].id,
        authorId: user3.id,
      },
      {
        content: 'Amazing article! The code examples are very clear.',
        postId: createdPosts[2].id,
        authorId: demoUser.id,
      },
    ];

    await db.insert(comments).values(sampleComments);
    console.log('✅ Comments created');

    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('Demo credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();