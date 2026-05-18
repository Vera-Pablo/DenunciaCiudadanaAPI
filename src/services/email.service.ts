import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.ethereal.email",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendStatusUpdateNotification(
    to: string,
    trackingNum: string,
    newStatus: string,
  ) {
    const mailOptions = {
      from: '"Denuncia Ciudadana" <no-reply@denunciaciudadana.gov.ar>',
      to,
      subject: `Actualización de su denuncia: ${trackingNum}`,
      text: `Hola, el estado de su denuncia con número de seguimiento ${trackingNum} ha cambiado a: ${newStatus}.`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .brand-text { color: #c57b57 !important; }
          .status-badge { 
            background-color: #f5e3dc; 
            color: #522d1d; 
            padding: 8px 16px; 
            border-radius: 12px; 
            display: inline-block;
            font-weight: 600;
            margin-top: 10px;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf9f6; color: #4a3f35;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e6dcd1;">
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: #c57b57;">
                      Denuncia Ciudadana
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 20px 40px 40px 40px; line-height: 1.6; font-size: 16px;">
                    <p style="margin-top: 0;">Hola,</p>
                    <p>Le informamos que ha habido una actualización en el seguimiento de su reporte. Nuestro equipo ha registrado un cambio en el estado del mismo.</p>
                    
                    <div style="background-color: #f2ebe3; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px dashed #d6cec5;">
                      <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #857a70; font-weight: 600;">Número de Seguimiento</p>
                      <p style="margin: 4px 0 16px 0; font-size: 20px; font-weight: 700; color: #4a3f35;">${trackingNum}</p>
                      
                      <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #857a70; font-weight: 600;">Nuevo Estado</p>
                      <span style="background-color: #f5e3dc; color: #522d1d; padding: 6px 12px; border-radius: 8px; display: inline-block; font-weight: 600; margin-top: 8px; font-size: 15px;">
                        ${newStatus}
                      </span>
                    </div>

                    <p>Para ver más detalles o realizar un seguimiento interactivo, puede acceder a su panel ciudadano en nuestra plataforma.</p>
                    
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="padding: 30px 40px; background-color: #fcf9f6; border-top: 1px solid #e6dcd1;">
                    <p style="margin: 0; font-size: 13px; color: #857a70;">
                      Este es un mensaje automático, por favor no responda a este correo.<br>
                      © 2026 Municipalidad de Corrientes - Sistema de Denuncias
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

    try {
      console.log(
        `[EMAIL SERVICE] Preparando envío de notificación a ${to} por reporte ${trackingNum}`,
      );
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(
          "[EMAIL SERVICE] Credenciales no configuradas. Mock email content:",
          JSON.stringify(mailOptions, null, 2),
        );
        return;
      }

      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email enviado con éxito a ${to}`);
    } catch (error) {
      console.error("[EMAIL SERVICE] Error enviando email:", error);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

    const mailOptions = {
      from: ' "Denuncia Ciudadana" <no-reply@denunciaCiudadana.gov.ar>',
      to,
      subject: 'Recuperación de contraseña',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .btn-primary {
            background-color: #c57b57;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #fcf9f6; color: #4a3f35;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e6dcd1; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 40px;">
                    <h1 style="margin: 0; font-size: 24px; color: #c57b57;">Recuperar Contraseña</h1>
                    <p style="margin-top: 20px; line-height: 1.6;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar. Este enlace expirará en 15 minutos.</p>
                    <a href="${resetUrl}" class="btn-primary">Restablecer Contraseña</a>
                    <p style="margin-top: 20px; font-size: 14px; color: #857a70;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
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

    try {
      // test in console.log
      console.log("\n============================================");
      console.log("🔗 LINK DE RECUPERACIÓN GENERADO:");
      console.log(resetUrl);
      console.log("============================================\n");

      // test with credentials.
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("[EMAIL SERVICE] Variables de entorno vacías. Correo NO enviado.");
        return;
      }
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email de recuperación enviado exitosamente a ${to}`);
    } catch (error) {
      console.error("[EMAIL SERVICE] Error enviando email de recuperación:", error);
    }
  }
}

export const emailService = new EmailService();
