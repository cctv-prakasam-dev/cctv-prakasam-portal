/**
 * Professional email template wrapper matching CCTV AP Prakasam brand.
 * Dark header with logo text, cyan accents, clean footer.
 */

interface EmailTemplateOptions {
  /** Main body HTML content */
  body: string;
  /** Optional preview text (shows in inbox before opening) */
  previewText?: string;
}

function wrapEmailTemplate({ body, previewText }: EmailTemplateOptions): string {
  const preview = previewText
    ? `<div style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CCTV AP Prakasam</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  ${preview}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0c1a2b 0%,#162033 100%);padding:28px 32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Logo text badge -->
                    <div style="display:inline-block;background:linear-gradient(135deg,#0891B2,#06B6D4);padding:8px 20px;border-radius:8px;margin-bottom:8px;">
                      <span style="font-family:'Segoe UI',Tahoma,sans-serif;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:3px;">CC</span><span style="font-family:'Segoe UI',Tahoma,sans-serif;font-size:22px;font-weight:800;color:#DB2777;letter-spacing:3px;">TV</span>
                    </div>
                    <div style="font-family:'Segoe UI',Tahoma,sans-serif;font-size:11px;color:#94a3b8;letter-spacing:3px;margin-top:6px;">AP PRAKASAM</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#0891B2,#06B6D4,#DB2777);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="border-top:1px solid #e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#64748b;">
                CCTV AP Prakasam &mdash; Prakasam District's Trusted Digital News
              </p>
              <p style="margin:0 0 12px 0;font-size:11px;color:#94a3b8;">
                RTC Bus Stand Backside, Mulaguntapadu, Singarayakonda, AP &mdash; 523101
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="https://www.youtube.com/@CctvPrakasam" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#0c1a2b;color:#94a3b8;border-radius:6px;font-size:12px;text-decoration:none;">&#9654;</a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://www.facebook.com/cctvprakasam" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#0c1a2b;color:#94a3b8;border-radius:6px;font-size:12px;text-decoration:none;">f</a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://twitter.com/cctvprakasam" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:#0c1a2b;color:#94a3b8;border-radius:6px;font-size:12px;text-decoration:none;">&#120143;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0 0;font-size:10px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} CCTV AP Prakasam. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { wrapEmailTemplate };
