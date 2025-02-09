// sendgrid用

// import sgMail from "@sendgrid/mail";

// export const sendMail = async ({
//   name,
//   email,
//   message,
// }: {
//   name: string;
//   email: string;
//   message: string;
// }) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

//   const msg = {
//     to: "test01@email.com",
//     from: "test02@email.com",
//     subject: `Contact from ${name}`,
//     text: `
//       Name: ${name}
//       Email: ${email}
//       Message: ${message}
//     `,
//   };

//   return sgMail.send(msg);
// };
