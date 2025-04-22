
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;
  const client = await clientPromise;
  const db = client.db("your-db-name");

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "User registered", userId: newUser.insertedId });
}
