import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      recipientEmail,
      recipientName,
      subject,
      body,
      pdfBase64,
      pdfFileName,
      smtpConfig,
    } = payload;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email address is required." },
        { status: 400 }
      );
    }

    const host = smtpConfig?.host || process.env.SMTP_HOST || "smtppro.zoho.in";
    const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 465);
    const secure = port === 465;
    const user = smtpConfig?.user || process.env.SMTP_USER || "admin@ivrtechsolution.in";
    const pass = smtpConfig?.pass || process.env.SMTP_PASS;

    if (!pass) {
      return NextResponse.json(
        {
          success: false,
          needsAuth: true,
          message:
            "SMTP password or Zoho Mail app password is not configured. You can send directly via Zoho Mail Web, Gmail Web, or configure your SMTP password in Company Settings.",
        },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const attachments: any[] = [];
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      attachments.push({
        filename: pdfFileName || "IVR_Internship_Offer_Letter.pdf",
        content: Buffer.from(cleanBase64, "base64"),
        contentType: "application/pdf",
      });
    }

    const info = await transporter.sendMail({
      from: `"${smtpConfig?.fromName || "IVR Tech Solutions"}" <${user}>`,
      to: `"${recipientName}" <${recipientEmail}>`,
      subject: subject || "Internship Offer Letter - IVR Tech Solutions Private Limited",
      text: body,
      attachments,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `Offer letter email delivered successfully to ${recipientEmail}`,
    });
  } catch (error: any) {
    console.error("Failed to send email via SMTP:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to deliver email through SMTP server.",
      },
      { status: 500 }
    );
  }
}

