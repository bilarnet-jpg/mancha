import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "cartoes@amici1914.com.br";

serve(async (req) => {
  try {
    const { recipientName, recipientEmail, senderName, senderEmail, message, templateName, templateImageUrl } = await req.json();

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "Email do destinatario nao informado" }), { status: 400 });
    }

    const emailHtml = `
<div style="font-family: Arial, sans-serif; background-color: #0A1F14; padding: 40px 20px; text-align: center;">
  <h1 style="color: #00FF85; font-size: 22px; margin: 0 0 24px 0;">Voce recebeu um Cartao da Mancha!</h1>

  <div style="max-width: 480px; margin: 0 auto; border-radius: 16px; overflow: hidden; background-color: #134227;">
    ${templateImageUrl ? `<img src="${templateImageUrl}" alt="${templateName}" style="width: 100%; display: block;" />` : ''}
    <div style="padding: 28px; text-align: left;">
      <p style="color: #00FF85; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0;">Para ${recipientName}</p>
      <p style="color: #ffffff; font-size: 16px; line-height: 24px; margin: 0 0 20px 0; font-style: italic;">"${message}"</p>
      <p style="color: #cccccc; font-size: 14px; margin: 0;">Com carinho, ${senderName}</p>
    </div>
  </div>

  <p style="color: #999999; font-size: 12px; margin-top: 24px;">Enviado atraves do app oficial Mancha Carnaval.</p>
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Mancha Carnaval <${FROM_EMAIL}>`,
        to: [recipientEmail],
        reply_to: senderEmail || undefined,
        subject: `Voce recebeu um cartao de ${senderName}!`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
