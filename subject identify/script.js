let video;
let model;

// Load the COCO-SSD model
async function loadModel() {
  model = await cocoSsd.load();
  console.log("Model loaded successfully.");
}

// Start the webcam feed
async function setupWebcam() {
  video = document.getElementById("webcam");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

// Detect objects in the video stream
async function detectObjects() {
  const predictions = await model.detect(video);
  drawPredictions(predictions);
  requestAnimationFrame(detectObjects);
}

// Draw predictions on the canvas
function drawPredictions(predictions) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Clear the canvas before drawing
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw the bounding boxes for each object
  predictions.forEach((prediction) => {
    context.beginPath();
    context.rect(...prediction.bbox);
    context.lineWidth = 2;
    context.strokeStyle = "red";
    context.fillStyle = "red";
    context.stroke();
    context.fillText(
      prediction.class + ": " + Math.round(prediction.score * 100) + "%",
      prediction.bbox[0],
      prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
    );
  });
}

// Load the model and start detecting objects
loadModel().then(setupWebcam).then(detectObjects);
