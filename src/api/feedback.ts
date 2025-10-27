export const prerender = false; // 「server」モードでは不要です
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  // データのバリデーション — 実際にはこれ以上の検証を行う必要がある場合が多いです
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
  // データを処理して、成功レスポンスを返す
  return new Response(
    JSON.stringify({
      message: "Success!"
    }),
    { status: 200 }
  );
};