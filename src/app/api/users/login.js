
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  const client = await clientPromise;
  const db = client.db("your-db-name");

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

  // For real projects, you'd issue a token here (JWT, session, etc.)
  res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
}
