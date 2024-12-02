import cv2
import numpy as np
import time
from datetime import datetime as dt, timezone
from services.firebase_docker_services import Connection_Docker
import os
from watchdog.observers.polling import PollingObserver
from watchdog.events import FileSystemEventHandler

# Configurations
whT = 320
confThreshold = 0.5
nmsThreshold = 0.5
classesfile = '/app/coco.names.txt'
modelConfig = '/app/yolov3.cfg.cfg'
modelWeights = '/app/yolov3.weights'
image_folder_path = "/app/images/"  # Directory where new images will be added
processed_folder_path = "/app/result"  # Directory where processed images will be saved

# Load class names
classNames = []
with open(classesfile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

# Load YOLO model
net = cv2.dnn.readNetFromDarknet(modelConfig, modelWeights)
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)


def findObject(outputs, im):
    """Detect and count objects in the image."""
    hT, wT, cT = im.shape
    bbox = []
    classIds = []
    confs = []
    person_count = 0  # Counter for "Person" detections
    bus_count = 0  # Counter for "Bus" detections
    data_violations_perday = {
            "sum": 0,
            "timeAdded": dt.now(timezone.utc),  # UTC timestamp
        }

    for output in outputs:
        for det in output:
            scores = det[5:]
            classId = np.argmax(scores)
            confidence = scores[classId]
            if confidence > confThreshold:
                w, h = int(det[2] * wT), int(det[3] * hT)
                x, y = int((det[0] * wT) - w / 2), int((det[1] * hT) - h / 2)
                bbox.append([x, y, w, h])
                classIds.append(classId)
                confs.append(float(confidence))

    # Apply Non-Maximum Suppression
    indices = cv2.dnn.NMSBoxes(bbox, confs, confThreshold, nmsThreshold)

    if len(indices) > 0:
        for i in indices.flatten():
            x, y, w, h = bbox[i]
            label = classNames[classIds[i]]

            if label == 'person':
                person_count += 1
            elif label == 'bus':
                bus_count += 1

            cv2.rectangle(im, (x, y), (x + w, y + h), (255, 0, 255), 2)
            cv2.putText(im, f'{label.upper()} {int(confs[i] * 100)}%', (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)

    # Annotate counts
    cv2.putText(im, f'Persons detected: {person_count}', (20, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(im, f'Buses detected: {bus_count}', (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    print(f'Persons detected: {person_count}')
    print(f'Buses detected: {bus_count}')

    # Get current time in epoch (seconds since Jan 1, 1970)
    data_violations_perday = {
            "sum": person_count,
            "timeAdded": dt.now(timezone.utc),  # UTC timestamp
        }
    
    return data_violations_perday

# Firebase Connection_Docker
firebase = Connection_Docker()
firebase.initialize_sdk()

# Watchdog event handler to process new images
class ImageHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith(('.jpg', '.png')):
            print(f"New image detected: {event.src_path}")
            self.process_image(event.src_path)

    def process_image(self, image_path):
        # Load and preprocess the image
        im = cv2.imread(image_path)
        if im is None:
            print(f"Error: Unable to read the image {image_path}.")
            return

        # Perform object detection
        blob = cv2.dnn.blobFromImage(im, 1 / 255, (whT, whT), [0, 0, 0], 1, crop=False)
        net.setInput(blob)
        layerNames = net.getLayerNames()
        outputNames = [layerNames[i - 1] for i in net.getUnconnectedOutLayers()]
        outputs = net.forward(outputNames)
        
        # Detect and annotate objects in the image
        data = findObject(outputs, im)

        # Save the processed image temporarily with timestamp
        timestamp = time.strftime("%Y%m%d_%H%M%S")  # Get current time in "YYYYMMDD_HHMMSS" format
        processed_image_path = f"processed_image_{timestamp}.jpg"
        processed_image_folder_path = f"{processed_folder_path}/{processed_image_path}"
        blob_image_path = f"result_predict/{processed_image_path}"
        cv2.imwrite(processed_image_folder_path, im)

        # Upload to Firebase
        try:
            firebase.upload_image(processed_image_folder_path, blob_image_path)
            firebase.post_doc(data, "sum-person")
            print(f"Uploaded image {processed_image_path} to Firebase.")
        except Exception as e:
            print(f"Error during upload: {e}")

        # After uploading, delete the processed image from the folder
        if os.path.exists(processed_image_folder_path):
            os.remove(processed_image_folder_path)
            print(f"Deleted file: {processed_image_folder_path}")
        else:
            print(f"File not found: {processed_image_folder_path}")


# Initialize and start the watchdog observer
event_handler = ImageHandler()
observer = PollingObserver()
observer.schedule(event_handler, image_folder_path, recursive=False)
observer.start()

print(f"Watching for new images in '{image_folder_path}'...")

try:
    while True:
        time.sleep(1)  # Keep the script running to monitor the image folder
except KeyboardInterrupt:
    observer.stop()

observer.join()
