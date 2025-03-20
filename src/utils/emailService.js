import emailjs from 'emailjs-com';

const SERVICE_ID = "service_1";  // Replace with your actual Service ID
const TEMPLATE_ID = "template";  // Replace with your actual Template ID
const USER_ID = "GsqK9QNN8re0JhJjn";  // Replace with your actual User ID

export function sendEmail(sessionResults, candidateEmail, sponsorEmail) {
    if (!candidateEmail || !sponsorEmail || !sessionResults) {
        console.error("❌ Error: Missing information for sending the email.");
        alert("Please fill in all fields before sending the email.");
        return;
    }

    const emailParams = {
        session_results: sessionResults,
        candidate_email: candidateEmail,
        sponsor_email: sponsorEmail,
    };

    console.log("📨 Sending email with EmailJS...", emailParams);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID)
        .then((response) => {
            console.log("✅ Email sent successfully!", response.status, response.text);
            alert("Email sent successfully!");
        })
        .catch((error) => {
            console.error("❌ Failed to send email:", error);
            alert("Error sending email. Check the console.");
        });
}
