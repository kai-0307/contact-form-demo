import { serve } from "@hono/node-server";
import nodemailer from "nodemailer";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const app = new Hono();

dotenv.config();

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmailの場合
  // port: 587,
  // secure: false,
  port: 465, // Gmail の SMTP サーバー (TLS)
  secure: true, // true にするとポート 465 を使用
  auth: {
    user: process.env.EMAIL_USER, // Gmailアドレス
    pass: process.env.EMAIL_PASS, // アプリパスワード(Gmailで別途設定が必要)
  },
});

// SQLiteデータベースの設定
const db = new sqlite3.Database("./contacts.db");
db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// JSONファイル保存用の関数
const saveToJson = async (data: any) => {
  const contact = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  const filePath = path.join(process.cwd(), "contacts.json");
  const contacts = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : [];

  contacts.push(contact);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
};

// SQLiteに保存する関数
const saveToDb = (
  name: string,
  email: string,
  message: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
      (err: any) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

// バリデーションスキーマ
const contactSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Received request body:", body);

    const validatedData = contactSchema.parse(body);

    // DBとJSONに保存
    try {
      await saveToDb(
        validatedData.name,
        validatedData.email,
        validatedData.message
      );
      await saveToJson(validatedData);

      // メール送信
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: validatedData.email,
        subject: `お問い合わせを受け付けました`,
        text: `
${validatedData.name} 様

お問い合わせありがとうございます。
以下の内容で受け付けました。

【お問い合わせ内容】
${validatedData.message}

このメールは自動送信されています。
        `.trim(),
      });

      console.log("Contact saved and email sent successfully");
    } catch (error) {
      console.error("Failed to process contact:", error);
      throw new Error("処理に失敗しました");
    }

    return c.json(
      {
        success: true,
        message: "お問い合わせを受け付けました",
      },
      200
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
      500
    );
  }
});

const port = 8000;
console.log(`Starting server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});
