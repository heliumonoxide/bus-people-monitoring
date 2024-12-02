import cv2
import numpy as np
import urllib.request
import time

url = r"D:\Bryan_Workspace\bus-people-monitoring\yolov3-python\person.jpg"

cap = cv2.imread(url)
whT = 320
confThreshold = 0.5
nmsThreshold = 0.5  # Increased threshold to reduce duplicate bounding boxes
classesfile = 'coco.names.txt'
classNames = []

with open(classesfile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

modelConfig = 'yolov3.cfg.cfg'
modelWeights = 'yolov3.weights'
net = cv2.dnn.readNetFromDarknet(modelConfig, modelWeights)
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)


def findObject(outputs, im):
    hT, wT, cT = im.shape
    bbox = []
    classIds = []
    confs = []
    person_count = 0  # Counter for "Person" detections
    bus_count = 0  # Counter for "Bus" detections

    for output in outputs:
        for det in output:
            scores = det[5:]
            classId = np.argmax(scores)
            confidence = scores[classId]
            if confidence > confThreshold:
                w, h = int(det[2] * wT), int(det[3] * hT)
                x, y = int((det[0] * wT) - w / 2), int((det[1] * hT) - h / 2)
                if classNames[classId] in ['person', 'bus']:
                    bbox.append([x, y, w, h])
                    classIds.append(classId)
                    confs.append(float(confidence))

    # Apply Non-Maximum Suppression to avoid duplicate detections
    indices = cv2.dnn.NMSBoxes(bbox, confs, confThreshold, nmsThreshold)

    detected_person_boxes = []  # To store filtered person boxes
    if len(indices) > 0 and isinstance(indices, np.ndarray):
        for i in indices.flatten():
            box = bbox[i]
            x, y, w, h = box[0], box[1], box[2], box[3]
            label = classNames[classIds[i]]

            if label == 'person':
                # Filter similar bounding boxes to reduce duplicate person count
                if not any(np.linalg.norm(np.array([x, y]) - np.array([bx, by])) < 30 for bx, by, bw, bh in
                           detected_person_boxes):
                    detected_person_boxes.append([x, y, w, h])
                    person_count += 1  # Increment person count

            elif label == 'bus':
                bus_count += 1  # Increment bus count

            cv2.rectangle(im, (x, y), (x + w, y + h), (255, 0, 255), 2)
            cv2.putText(im, f'{label.upper()} {int(confs[i] * 100)}%', (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)
    else:
        print("No objects detected or invalid index format")

    # Display the counts of detected persons and buses on the image
    cv2.putText(im, f'Persons detected: {person_count}', (20, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(im, f'Buses detected: {bus_count}', (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Print the counts to the console
    print(f'Persons detected: {person_count}')
    print(f'Buses detected: {bus_count}')


# Timer to control frame processing every 2 seconds
last_frame_time = 0
frame_interval = 2  # in seconds

# Corrected image loading logic
while True:
    current_time = time.time()
    if current_time - last_frame_time >= frame_interval:
        # Update last frame time
        last_frame_time = current_time

        # Load the image directly from the file path
        im = cv2.imread(url)

        if im is None:
            print("Error: Unable to read image. Please check the file path.")
            break

        # Preprocess and detect objects
        blob = cv2.dnn.blobFromImage(im, 1 / 255, (whT, whT), [0, 0, 0], 1, crop=False)
        net.setInput(blob)
        layernames = net.getLayerNames()
        outputNames = [layernames[i - 1] for i in net.getUnconnectedOutLayers()]

        outputs = net.forward(outputNames)

        findObject(outputs, im)

        # Show the image with detections
        cv2.imshow('Image', im)

    # Exit the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
