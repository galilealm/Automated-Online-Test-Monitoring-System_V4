import { useState, useRef, useEffect } from "react";
import { Webcam } from "../utils/webcam";
import { sendEmail } from "../utils/emailService"; // Importation du service d'envoi d'email

const ButtonHandler = ({ imageRef, cameraRef, videoRef, toggleSession, sessionActive, summary }) => {
  const [streaming, setStreaming] = useState(null);
  const inputImageRef = useRef(null);
  const inputVideoRef = useRef(null);
  const webcam = new Webcam();

  // États pour le formulaire de saisie des emails
  const [showModal, setShowModal] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);


  // Vérifier si la session est terminée et envoyer les résultats
  useEffect(() => {
    if (sessionEnded && summary) {
      console.log("Envoi du résumé :", summary);
      sendEmail(summary, candidateEmail, sponsorEmail);
    }
  }, [summary, sessionEnded]);

  // Fonction d'ouverture de la caméra frontale
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
      setSessionEnded(false); // La session commence
    } catch (error) {
      alert("Erreur d'accès à la caméra : " + error.message);
    }
  };

  // Fonction de fermeture de la caméra frontale et d'envoi des emails
  const closeFrontCamera = () => {
    const tracks = cameraRef.current.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    cameraRef.current.srcObject = null;
    cameraRef.current.style.display = "none";
    setStreaming(null);
    toggleSession();
    setSessionEnded(true);
  };

  // Validation et ouverture de la caméra après la saisie des emails
  const handleStartSession = () => {
    if (!candidateEmail || !sponsorEmail) {
      alert("Veuillez renseigner les adresses e-mail du candidat et du sponsor.");
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
        {streaming === "frontCamera" ? "Fermer la session" : "Démarrer la session"}
      </button>

      {/* Modal pour saisir les emails avant la session */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Informations de la session</h2>
            <input
              type="email"
              placeholder="Email du candidat"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email du sponsor"
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              required
            />
            <button onClick={handleStartSession}>Démarrer la session</button>
            <button onClick={() => setShowModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonHandler;
