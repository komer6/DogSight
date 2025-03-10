import React, { useRef, useEffect, useState } from "react";

const CameraFeed: React.FC = () => {
  const videoRefFront = useRef<HTMLVideoElement>(null);
  const videoRefBack = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const startCameras = async () => {
      try {
        // Access both front and back cameras
        const streamFront = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // Front camera
        });

        const streamBack = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Back camera
        });

        // Set front camera video stream
        if (videoRefFront.current) {
          videoRefFront.current.srcObject = streamFront;
        }

        // Set back camera video stream
        if (videoRefBack.current) {
          videoRefBack.current.srcObject = streamBack;
        }
      } catch (error) {
        console.error("Error accessing camera(s):", error);
      }
    };

    startCameras();

    // Capture photo every 0.3 seconds
    const captureInterval = setInterval(() => {
      if (videoRefFront.current && videoRefBack.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Set canvas size to match the front video size
          canvas.width = videoRefFront.current.videoWidth;
          canvas.height = videoRefFront.current.videoHeight;

          // Draw the front camera frame on canvas
          ctx.drawImage(videoRefFront.current, 0, 0, canvas.width, canvas.height);

          // Convert canvas to image data URL (base64 encoded)
          const imageUrl = canvas.toDataURL("image/png");
          setPhoto(imageUrl);  // Store image in state
        }
      }
    }, 300);  // Capture every 0.3 seconds

    // Cleanup function to stop interval when component unmounts
    return () => clearInterval(captureInterval);
  }, []);

  return (
    <table>
      <tr><th>Camera Feed</th></tr>
      <tr>
        {/* Front Camera */}
        <td>
          <h3>Front Camera</h3>
          <video ref={videoRefFront} autoPlay playsInline style={{ width: "50%" }} />
        </td>

        {/* Back Camera */}
        <td>
          <h3>Back Camera</h3>
          <video ref={videoRefBack} autoPlay playsInline style={{ width: "50%" }} />
        </td>
      </tr>

      {/* Display captured photo */}
      <tr>
        {photo && (
          <td colSpan={2}>
            <h3>Captured Photo:</h3>
            <img src={photo} alt="Captured" style={{ width: "50%" }} />
          </td>
        )}
      </tr>

      {/* Hidden canvas used to capture frames */}
      <tr>
        <td colSpan={2}>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </td>
      </tr>
    </table>
  );
};

export default CameraFeed;
