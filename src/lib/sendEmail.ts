import nodemailer from 'nodemailer';

export const sendPassEmail = async (to: string, name: string, passes: string, ticketId: string, origin: string) => {
  console.log("sendPassEmail called for:", to, "with user:", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const passUrl = `${origin}/pass/${ticketId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #4a0a14; padding: 20px; border-radius: 12px; border: 1px solid #cda434;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #cda434; font-size: 28px; font-weight: 900; margin-bottom: 5px; letter-spacing: -0.5px; text-transform: uppercase;">SANSKRUTIK GARBA</h1>
        <p style="color: #E3C57F; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your Payment is Approved!</p>
      </div>

      <div style="background-color: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 12px; text-align: center; border: 1px solid rgba(227, 197, 127, 0.2);">
        <p style="font-size: 18px; color: #ffffff; margin-bottom: 20px;">Hi <strong style="color: #E3C57F;">${name}</strong>,</p>
        
        <p style="color: #eeeeee; line-height: 1.6; margin-bottom: 25px;">
          Your registration for <strong style="color: #E3C57F;">${passes} passes</strong> has been successfully approved! 
          You can now view and download your official digital event pass below.
        </p>

        <a href="${passUrl}" style="display: inline-block; background-color: #E3C57F; color: #4a0a14; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
          View My Pass
        </a>
      </div>

      <div style="text-align: center; margin-top: 25px; color: #E3C57F; font-size: 12px; opacity: 0.8;">
        <p>Please show the QR code on your digital pass at the entrance.</p>
        <p>If you have any questions, reply to this email.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Sanskrutik Garba" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🎟️ Your Garba Pass is Approved!',
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
