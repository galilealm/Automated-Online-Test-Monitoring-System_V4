import { useState, useRef, useEffect } from "react";
import { Webcam } from "../utils/webcam";
import { sendEmail } from "../utils/emailService"; // Email sending service

const ButtonHandler = ({ imageRef, cameraRef, videoRef, toggleSession, sessionActive, summary }) => {
  const [streaming, setStreaming] = useState(null);
  const inputImageRef = useRef(null);
  const inputVideoRef = useRef(null);
  const webcam = new Webcam();

  // Form and session states
  const [showModal, setShowModal] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track form submission attempt

  // Email format validator
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Send summary when session ends
  useEffect(() => {
    const sendSummary = async () => {
      try {
        setIsSending(true);
        await sendEmail(summary, candidateEmail, sponsorEmail);
        alert("Session summary sent successfully.");
      } catch (error) {
        console.error("Email sending failed:", error);
        alert("Failed to send session summary.");
      } finally {
        setIsSending(false);
      }
    };

    if (sessionEnded && summary) {
      sendSummary();
    }
  }, [summary, sessionEnded]);

  // Open the webcam
  const openFrontCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Your browser does not support webcam access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      cameraRef.current.srcObject = stream;
      cameraRef.current.style.display = "block";
      setStreaming("frontCamera");
      toggleSession();
      setSessionEnded(false);
    } catch (error) {
      alert("Error accessing the camera: " + error.message);
    }
  };

  // Stop the webcam and end session
  const closeFrontCamera = () => {
    const tracks = cameraRef.current.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    cameraRef.current.srcObject = null;
    cameraRef.current.style.display = "none";
    setStreaming(null);
    toggleSession();
    setSessionEnded(true);
  };

  // Start session with validation
  const handleStartSession = () => {
    setHasSubmitted(true); // Enable error display

    // Basic validations
    if (!candidateEmail || !sponsorEmail) return;
    if (!isValidEmail(candidateEmail) || !isValidEmail(sponsorEmail)) return;
    if (!termsAccepted) return;

    // All good, start session
    setShowModal(false);
    openFrontCamera();
  };

  return (
    <div className="btn-container">
      {/* Session toggle button */}
      <button
        onClick={() => {
          if (streaming === null || streaming !== "frontCamera") {
            setShowModal(true);
          } else {
            closeFrontCamera();
          }
        }}
      >
        {streaming === "frontCamera" ? "Close the session" : "Start the session"}
      </button>

      {/* Modal with form inputs */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Session Information</h2>

            {/* Candidate Email */}
            <label htmlFor="candidateEmail">Candidate Email</label>
            <input
              id="candidateEmail"
              type="email"
              placeholder="Candidate's email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              required
            />
            {hasSubmitted && !candidateEmail && (
              <p className="error-text">Candidate email is required.</p>
            )}
            {hasSubmitted && candidateEmail && !isValidEmail(candidateEmail) && (
              <p className="error-text">Please enter a valid candidate email.</p>
            )}

            {/* Sponsor Email */}
            <label htmlFor="sponsorEmail">Sponsor Email</label>
            <input
              id="sponsorEmail"
              type="email"
              placeholder="Sponsor's email"
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              required
            />
            {hasSubmitted && !sponsorEmail && (
              <p className="error-text">Sponsor email is required.</p>
            )}
            {hasSubmitted && sponsorEmail && !isValidEmail(sponsorEmail) && (
              <p className="error-text">Please enter a valid sponsor email.</p>
            )}

            {/* Terms of Use Checkbox */}
            <div className="terms-container">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms">
                I accept the{" "}
                <a
                  href="https://fefe29.github.io/Automated-Online-Test-Monitoring-System_V4/privacy_policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>.
              </label>
            </div>
            {hasSubmitted && !termsAccepted && (
              <p className="error-text">You must accept the Terms of Use to continue.</p>
            )}

            {/* Start Button */}
            <button onClick={handleStartSession}>
              Start the session
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Optional loader while email is being sent */}
      {isSending && (
        <p className="sending-status">Sending session report...</p>
      )}

      {/* User Guide Footer */}
      <div className="footer-info">
        <p>
          First use? Check our{" "}
          <a
            href="https://fefe29.github.io/Automated-Online-Test-Monitoring-System_V4/user_doc.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            user guide
          </a>
        </p>
      </div>
    </div>
  );
};

export default ButtonHandler;
