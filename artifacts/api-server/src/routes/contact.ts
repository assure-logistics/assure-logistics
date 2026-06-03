import { Router } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  }
  return null;
}

function servicesHtml(name: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:#0f1b2d;padding:24px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#fbbf24;border-radius:6px;padding:6px 10px;margin-right:10px;">
                <span style="font-size:18px;font-weight:900;color:#0f1b2d;">⚡</span>
              </td>
              <td style="padding-left:10px;">
                <span style="font-size:18px;font-weight:700;color:#ffffff;">Assure <span style="color:#fbbf24;">Logistics</span></span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f1b2d;">Thanks for reaching out, ${name}!</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              We've received your inquiry and our logistics team will follow up within one business day.
              In the meantime, here's a summary of our core services:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              ${[
    ["🚛 Full Truckload (FTL)", "Dedicated capacity for large loads. Direct point-to-point routing, no stops."],
    ["📦 Less-Than-Truckload (LTL)", "Cost-effective shared shipping. Pay only for the space you use."],
    ["🌐 International Freight", "Cross-border logistics with customs brokerage and compliance."],
    ["🏭 Warehousing & Distribution", "Short and long-term storage with fulfillment services."],
    ["⚡ Expedited Shipping", "Same-day or next-day delivery with priority carrier assignments."],
    ["🛡️ Freight Insurance", "Comprehensive all-risk cargo coverage with fast claims resolution."],
  ].map(([title, desc], i) => `
              <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-weight:600;color:#0f1b2d;font-size:14px;">${title}</p>
                  <p style="margin:4px 0 0;color:#64748b;font-size:13px;">${desc}</p>
                </td>
              </tr>`).join("")}
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td style="background:#0f1b2d;border-radius:6px;">
                  <a href="https://assurelogistics.com/services" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#fbbf24;text-decoration:none;">
                    View All Services →
                  </a>
                </td>
              </tr>
            </table>

            <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0;"/>
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              Questions? Call us at <strong>+1 (925) 580-8156</strong> or reply to this email.<br/>
              Assure Tour LLC DBA Assure Logistics Services · 4164 Powell Way Unit 101, Corona, CA 92883
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

router.post("/contact", async (req, res) => {
  const parse = ContactSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { name, email, company, subject, message } = parse.data;
  const transporter = buildTransporter();

  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL ?? process.env.SMTP_USER;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Assure Logistics" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Thanks for contacting Assure Logistics — our services overview",
        html: servicesHtml(name),
      });

      if (notifyTo) {
        await transporter.sendMail({
          from: `"Assure Logistics Website" <${process.env.SMTP_USER}>`,
          to: notifyTo,
          subject: `New inquiry from ${name}${company ? ` (${company})` : ""} — ${subject ?? "General"}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company ?? "—"}\nSubject: ${subject ?? "—"}\n\n${message}`,
        });
      }
    } catch (err) {
      req.log?.error({ err }, "Failed to send contact email");
      res.status(500).json({ error: "Failed to send email. Please try again." });
      return;
    }
  } else {
    req.log?.warn(
      { name, email },
      "No SMTP configured — contact form submitted but no email sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    );
  }

  res.status(200).json({ ok: true });
});

export default router;
