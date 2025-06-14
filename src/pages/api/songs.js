import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching songs:", error);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 