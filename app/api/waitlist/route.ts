import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, passNumber } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER || "info@vybeclub.co.in";
    const pass = process.env.SMTP_PASS || "Vybecode.co.in";
    const adminEmail = process.env.ADMIN_EMAIL || "info@vybeclub.co.in";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user,
        pass,
      },
    });

    const formattedPass = passNumber || `#0${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. VIP Member Welcome Email (Branded Dark-Mode Gen-Z HTML)
    const memberMailOptions = {
      from: `"VYBE CLUB" <${user}>`,
      to: email,
      subject: `YOU'RE IN. 👀 // VIP PASS ${formattedPass}`,
      text: `YOU'RE IN. 👀\n\nWelcome to VYBE CLUB.\nPass Identifier: ${formattedPass}\nStatus: PRE-RELEASE ALPHA // COHORT 01\n\nSomething different is coming. We are building a new way for the next generation to experience money, friends, goals and everyday life.\n\nKeep this confirmation secure. Drop announcements will arrive unannounced.\n\n— VYBE CLUB\nhttps://vybeclub.co.in`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>VYBE CLUB VIP PASS</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #070707; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #070707; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="540" style="max-width: 540px; background-color: #0e0e0e; border: 1px solid #222222; border-radius: 20px; overflow: hidden; padding: 35px 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                  
                  <!-- Brand Header -->
                  <tr>
                    <td align="left" style="padding-bottom: 25px; border-bottom: 1px solid #1a1a1a;">
                      <span style="display: inline-block; width: 8px; height: 8px; background-color: #CCFF00; border-radius: 50%; margin-right: 8px;"></span>
                      <strong style="font-size: 18px; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                        VYBE<span style="color: #CCFF00;">CLUB</span>
                      </strong>
                    </td>
                    <td align="right" style="padding-bottom: 25px; border-bottom: 1px solid #1a1a1a;">
                      <span style="font-size: 10px; font-family: monospace; letter-spacing: 1px; color: #CCFF00; background: rgba(204,255,0,0.1); border: 1px solid rgba(204,255,0,0.25); padding: 4px 8px; border-radius: 12px;">
                        VIP ACCESS
                      </span>
                    </td>
                  </tr>

                  <!-- Hero Badge & Status -->
                  <tr>
                    <td colspan="2" style="padding-top: 30px; text-align: center;">
                      <p style="margin: 0; font-family: monospace; font-size: 11px; letter-spacing: 3px; color: #777777; text-transform: uppercase;">
                        MEMBERSHIP VERIFICATION
                      </p>
                      <h1 style="margin: 10px 0 5px 0; font-size: 38px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">
                        YOU’RE IN. 👀
                      </h1>
                      <p style="margin: 0; font-size: 14px; color: #999999;">
                        Your spot on the private roster has been secured.
                      </p>
                    </td>
                  </tr>

                  <!-- Digital Token Card -->
                  <tr>
                    <td colspan="2" style="padding: 25px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #181818 0%, #0d0d0d 100%); border: 1px solid #333333; border-radius: 14px; padding: 20px;">
                        <tr>
                          <td style="font-family: monospace; font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                            IDENTIFIER
                          </td>
                          <td align="right" style="font-family: monospace; font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                            STATUS
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family: monospace; font-size: 22px; font-weight: bold; color: #CCFF00; padding-top: 4px;">
                            ${formattedPass}
                          </td>
                          <td align="right" style="font-family: monospace; font-size: 11px; font-weight: bold; color: #ffffff; padding-top: 4px;">
                            STAGE 01 ALPHA
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top: 15px; font-family: monospace; font-size: 10px; color: #555555;">
                            DROP 01 // LAUNCHING 2027
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Manifesto Note -->
                  <tr>
                    <td colspan="2" style="color: #aaaaaa; font-size: 14px; line-height: 1.6; text-align: left;">
                      <p style="margin: 0 0 12px 0;">
                        VYBE CLUB is building a new way for the next generation to experience money, friends, goals and everyday life. Not another boring bank. Not another spreadsheet.
                      </p>
                      <p style="margin: 0; color: #777777; font-size: 12px;">
                        Keep this email. Closed drop announcements and private access invitations will arrive unannounced directly to your inbox.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td colspan="2" style="padding-top: 30px; border-top: 1px solid #1a1a1a; margin-top: 25px; text-align: center;">
                      <p style="margin: 0; font-family: monospace; font-size: 10px; color: #444444; letter-spacing: 1px;">
                        © 2027 VYBE CLUB INC. • MONEY. PEOPLE. LIFE.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // 2. Notification Email to Admin (info@vybeclub.co.in)
    const adminMailOptions = {
      from: `"VYBE CLUB System" <${user}>`,
      to: adminEmail,
      subject: `⚡ New Waitlist Member: ${formattedPass} (${email})`,
      text: `New member joined the waitlist!\n\nEmail: ${email}\nPass Number: ${formattedPass}\nTimestamp: ${new Date().toISOString()}\nIP/Origin: Web Waitlist Form`,
    };

    // Send both emails in parallel
    const [memberResult, adminResult] = await Promise.allSettled([
      transporter.sendMail(memberMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    if (memberResult.status === "rejected") {
      console.error("Failed to send member email:", memberResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("Failed to send admin notification:", adminResult.reason);
    }

    return NextResponse.json({
      success: true,
      passNumber: formattedPass,
      emailSent: memberResult.status === "fulfilled",
    });
  } catch (error: unknown) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
