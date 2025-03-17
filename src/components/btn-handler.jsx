import { useState, useRef, useEffect } from "react";
import { Webcam } from "../utils/webcam";
import { sendEmail } from "../utils/emailService"; // Import the email sending service

const ButtonHandler = ({ imageRef, cameraRef, videoRef, toggleSession, sessionActive, summary }) => {
  const [streaming, setStreaming] = useState(null);
  const inputImageRef = useRef(null);
  const inputVideoRef = useRef(null);
  const webcam = new Webcam();

  // States for the email input form
  const [showModal, setShowModal] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check if the session has ended and send the results
  useEffect(() => {
    if (sessionEnded && summary) {
      console.log("Sending summary:", summary);
      sendEmail(summary, candidateEmail, sponsorEmail);
    }
  }, [summary, sessionEnded]);

  // Function to open the front camera
  const openFrontCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      cameraRef.current.srcObject = stream;
      cameraRef.current.style.display = "block";
      setStreaming("frontCamera");
      toggleSession();
      setSessionEnded(false); // The session starts
    } catch (error) {
      alert("Error accessing the camera: " + error.message);
    }
  };

  // Function to close the front camera and send emails
  const closeFrontCamera = () => {
    const tracks = cameraRef.current.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    cameraRef.current.srcObject = null;
    cameraRef.current.style.display = "none";
    setStreaming(null);
    toggleSession();
    setSessionEnded(true);
  };

  // Validate and open the camera after entering the emails
  const handleStartSession = () => {
    if (!candidateEmail || !sponsorEmail) {
      alert("Please enter the candidate's and sponsor's email addresses.");
      return;
    }
    if (!termsAccepted) {
      alert("Please accept the Terms of Use before starting the session.");
      return;
    }
    setShowModal(false);
    openFrontCamera();
  };

  return (
    <div className="btn-container">
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

      {/* Modal to enter emails before the session */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Session Information</h2>
            <input
              type="email"
              placeholder="Candidate's email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Sponsor's email"
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              required
            />
            <div className="terms-container">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms">
                I accept the <a href="https://www.google.fr" target="_blank" rel="noopener noreferrer">Terms of Use</a>.
              </label>
            </div>
            <button onClick={handleStartSession}>Start the session</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonHandler;