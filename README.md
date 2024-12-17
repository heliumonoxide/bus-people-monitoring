# Smart IoT Monitoring and AI System

![Banner Github Bus People](https://github.com/user-attachments/assets/7cd3566f-b1e1-4934-9eda-2e4f3cde8a8b)

This project is a complete IoT-based monitoring and AI solution designed to collect, process, and analyze data from ESP32 sensors and cameras, store it in Firebase, and deploy trained AI models for industrial automation. The entire system is architected with modern technologies, ensuring scalability, ease of use, and high performance.

---

## Table of Contents

- [Features](#features)
- [Project Directory Structure](#project-directory-structure)
- [Architecture Overview](#architecture-overview)
- [Technologies Used](#technologies-used)
- [System Flow](#system-flow)
  - [1. User Level](#1-user-level)
  - [2. Software Level](#2-software-level)
  - [3. Database Level](#3-database-level)
  - [4. Hardware Level](#4-hardware-level)
  - [5. AI Level](#5-ai-level)
- [Setup and Deployment](#setup-and-deployment)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database Configuration](#database-configuration)
  - [Google Cloud VM](#google-cloud-vm)
  - [AI Model Deployment](#ai-model-deployment)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

---

## **Project Directory Structure**

```plaintext
people-monitoring-device/
├── .git/                    # Git repository for version control
├── client/                  # Frontend application built with React Vite and Tailwind CSS
├── ESP32CAM/                # ESP32 CAM scripts for capturing and transferring images
├── webapi/                  # Backend API built with Express.js for handling data and Firebase integration
├── yolov3-python/                  # Python scripts for handling YOLOv3 model inference and Firebase integration
├── FlowDiagram.drawio       # Editable flow diagram of the system
├── FlowDiagram.drawio.png   # PNG version of the system flow diagram
├── LICENSE                  # License file for the project
└── README.md                # Project documentation (this file)
```

---

### Folder Descriptions

1. **`.git/`**  
   - Contains the Git metadata for version control.

2. **`client/`**  
   - Houses the source code for the frontend application.  
   - Built with **React Vite** and styled using **Tailwind CSS**.

3. **`ESP32CAM/`**  
   - Scripts for handling the **ESP32 CAM WROVER module**, including capturing images and sending them via FTP.

4. **`test_takepic/`**  
   - Contains testing utilities for capturing pictures with the ESP32 CAM WROVER to ensure proper functionality using Serial.

5. **`webapi/`**  
   - Backend code for the **Express.js API**, responsible for fetching data to Firebase.

6. **`yolov3-python/`**  
   - Python scripts for deploying the **YOLOv3 AI model** inference within Docker containers and integrated Firebase system for sending data.

7. **`FlowDiagram.drawio`**  
   - The editable **flow diagram** of the system, created in **Draw.io**.

8. **`FlowDiagram.drawio.png`**  
    - Exported PNG image of the system flow diagram for documentation purposes.

9. **`LICENSE`**  
    - Specifies the licensing terms for using and distributing this project.

10. **`README.md`**  
    - This file serves as the main documentation for the project.

---

## Features

- **Real-time data collection**: Collects data from ESP32 Ultrasonic and ESP32 CAM WROVER sensors.
- **Efficient storage and processing**: Stores data in Firestore and Firebase Storage.
- **Seamless AI integration**: Processes data using YOLOv3 models deployed via Docker.
- **Scalable architecture**: Modular design deployed across user, software, and AI levels.
- **Accessible front-end**: Responsive interface built with React Vite and Tailwind CSS, deployed on Vercel.

---

## Architecture Overview

The project is divided into five distinct layers:
1. **User Level**: Interaction through a React-based web app.
2. **Software Level**: Backend services using Express.js with Firebase Admin SDK.
3. **Database Level**: Firebase for data storage and triggering workflows.
4. **Hardware Level**: Sensors for data collection and file transfers via FTP.
5. **AI Level**: Dockerized training, testing, and deployment of AI models.

Refer to the system flow diagram for a visual overview of the process.

---

## Technologies Used

- **Frontend**: React Vite, Tailwind CSS
- **Backend**: Express.js, Firebase Admin SDK
- **Database**: Firestore Database, Firebase Storage
- **Cloud Infrastructure**: Google Cloud Compute Engine (VM Instance)
- **Hardware**: ESP32 Ultrasonic, ESP32 CAM WROVER, 3D handle, and 3D case
- **AI Frameworks**: YOLOv3, Docker
- **Deployment**: Vercel, SCP, and FTP protocols

---

## System Flow

### **1. User Level**
- Users interact with the system through a **React Vite + Tailwind CSS** web application.
- Deployed on **Vercel**, ensuring high availability and scalability.

### **2. Software Level**
- The backend is a serverless function developed using **Express.js** and deployed on **Vercel Serverless Functions**.
- It fetches and processes data from the Firebase database, responding to frontend requests.

### **3. Database Level**
- **Firestore Database** and **Firebase Storage** store and manage data received from the hardware level.
- Automated workflows triggered by a **watchdog** script running on the Google Cloud VM send processed results back to the database.

### **4. Hardware Level**
- **ESP32 Ultrasonic** and **ESP32 CAM WROVER**:
  - Ultrasonic sensors detect bus presence and send the data to Firebase.
  - ESP32 CAM WROVER collects images and transfers them via **FTP** to the Google Cloud VM.
- FTP transfers are managed securely with Google Cloud VM's SCP configuration.

### **5. AI Level**
- Data collected is used for training a **YOLOv3 model** within a Docker container.
- Trained models are deployed on the VM instance, monitoring results uploaded back to Firebase via **Watchdog**.

---

## Setup and Deployment

### **Frontend**

1. Navigate to the `client` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Deploy using Vercel for production.

### **Backend**

1. Navigate to the `webapi` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server locally:
   ```bash
   node server.js
   ```
4. Deploy to Google Cloud VM or Vercel as needed.

### **Database Configuration**

1. Set up Firestore Database and Firebase Storage.
2. Configure Firebase Admin SDK credentials in the backend.

### **Google Cloud VM**

1. Configure VM instance on Google Cloud.
2. Install Docker and FTP services (vsftpd).
3. Use SCP or FTP for file transfers.

### **AI Model Deployment**

1. Build Docker image for YOLOv3 model:
   ```bash
   docker build -t yolov3-python-v7-final .
   ```
2. Run Docker container locally:
   ```bash
   docker run --privileged -d -v Project-directory\yolov3-python\images:/app/images yolov3-python-v3
   docker logs -f 1cf8f4728055
   ```

 3. Save Docker Image:
     ```bash
     docker save -o yolov3-python-v7-final.tar yolov3-python-v7-final
     ```
     
  4. Run docker container on VM 
     ```bash
     docker load -i yolov3-python-v7-final.tar
     docker run -d -v /target-directory/esp_images:/app/images yolov3-python-v7-final
     ```
---

## Final Product Pictures

TBA (TO BE ADDED)

---

## Usage

1. **Real-time Monitoring**:
   - Access the React web app to view collected data and AI-generated results.
2. **Data Uploads**:
   - Sensor data automatically gets uploaded to Firebase and processed.
3. **AI Results**:
   - View predictions or results processed by the YOLOv3 model on the frontend.

---

## Credits
I would like to thank the following people and resources for their invaluable help and inspiration in the completion of this project:

- Electronic Clinic youtube channel for yolov3 tutorial: https://www.youtube.com/watch?v=npJsmbFZiMg
- Leonardo Bispo Team: For developing ESP32_FTPClient: https://github.com/ldab

Without the contributions and knowledge shared by these resources and individuals, this project would not have been possible.

---

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

