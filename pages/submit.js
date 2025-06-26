import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { firstName, lastName, email, message } = req.body;
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: `${firstName} ${lastName}` } }] },
        Email: { email },
        Message: { rich_text: [{ text: { content: message } }] }
      }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit to Notion" });
  }
}

