import emailjs from 'emailjs-com';

const SERVICE_ID = "service_1";
const TEMPLATE_ID = "template";
const USER_ID = "GsqK9QNN8re0JhJjn";

export function sendEmail(sessionResults, candidateEmail, sponsorEmail) {
    const emailParams = {
        session_results: sessionResults,
        candidate_email: candidateEmail,
        sponsor_email: sponsorEmail,
    };

    console.log("Sending email with EmailJS...", emailParams);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID)
        .then((response) => {
            console.log("Email sent!", response.status, response.text);
            alert("Email sent successfully!");
        })
        .catch((error) => {
            console.error("Failed to send email:", error);
            alert("Error sending email. Check the console.");
        });
}
