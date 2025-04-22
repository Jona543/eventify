
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db("your-db-name");

  if (req.method === "GET") {
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  }

  if (req.method === "PUT") {
    const { name, email } = req.body;
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, updatedAt: new Date() } }
    );
    res.status(200).json({ message: "User updated", result });
  }
}
