// app/api/users/route.js
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      name,
      email,
      passwordHash: hashedPassword,
      createdAt: new Date(),
    });

    return Response.json({ success: true, message: 'User created' });
  } catch (error) {
    console.error('User creation error:', error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');
    
        const allUsers = await users.find({}, { projection: { passwordHash: 0 } }).toArray();
        console.log('Retrieved users:', allUsers);
    
        return Response.json({ success: true, users: allUsers });
      } catch (error) {
        console.error('Error fetching users:', error.stack || error);
        return Response.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
      }
  }
  
