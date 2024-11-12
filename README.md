<h1 align="center">IoT-based Smart Dustbin Management System</h1>
<h3 align="center">A smart system that provides real-time data on dustbin fill levels and optimized waste collection routes</h3>

<h2 align="left">Software Components (Tech Stack and Tools) :</h2>
<p align="left">
<a href="https://docs.arduino.cc/software/ide/" target="_blank" rel="noreferrer"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXiHF4I0awSmLIjmeXu-qpaQPUIDJ7aRbjKw&s" alt="Ardino IDE" width="100" height="80"/> </a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="80" height="80"/> </a>
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="80" height="80"/> </a>
<a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="80" height="80"/> </a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="80" height="80"/> </a>
<a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="80" height="80"/> </a>
<a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://firebase.google.com/static/images/brand-guidelines/logo-vertical.png" alt="firebase" width="80" height="80"/> </a>
<a href="https://postman.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="80" height="80"/> </a>
</p>

<h2 align="left">Hardware Components :</h2>
<p align="left">
<a href="https://robomart.com/image/cache/catalog/RM000744/female-to-female-jumper-wires-pack-of-10-1600x1200.jpg.webp" target="_blank" rel="noreferrer"> <img src="https://robomart.com/image/cache/catalog/RM000744/female-to-female-jumper-wires-pack-of-10-1600x1200.jpg.webp" alt="jumperwires" width="120" height="80"/> </a>
<a href="https://www.amazon.in/Ultrasonic-Sensor-Module-HC-SR-04-Robokart/dp/B00ZNB01HI" target="_blank" rel="noreferrer"> <img src="https://m.media-amazon.com/images/I/612VzpvhpjL._AC_UF1000,1000_QL80_.jpg" alt="ultrasonic sensor" width="100" height="80"/> </a>
<a href="" target="_blank" rel="noreferrer"> <img src="https://m.media-amazon.com/images/I/61UOyRccN0L.jpg" alt="nodemcu" width="100" height="80"/> </a>
<a href="" target="_blank" rel="noreferrer"> <img src="https://m.media-amazon.com/images/I/519+S6mIXML.jpg" alt="Type B cable" width="100" height="80"/> </a>
<a href="" target="_blank" rel="noreferrer"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBZgiHJWDeYiOjzfkEW_DnW8qANWNuhQP0tw&s" alt="javascript" width="100" height="80"/> </a>
</p>

<h2 align="left">Overall Workflow</h2>

![image](https://github.com/user-attachments/assets/a96e2c0e-61f8-4841-9640-382b45690b8e)


<h2 align="left">Features</h2>

- The ultrasonic sensor gathers data on dustbin fill levels and transmits it to the NodeMCU for processing.

- The NodeMCU calculates the fill percentage of each dustbin.

- An **average of 10 readings**, recorded every **300 ms**, is calculated and stored in the **Firebase** database.

- This data is accessed by a web application, enabling real-time monitoring as it retrieves updates from the database at frequent intervals.

- **Each dustbin** is represented as a **node** in a **graph**, with paths (edges) between nodes indicating the distances between dustbins.

- Using the **fill percentages and distances**, the system computes the **optimal waste collection route and the associated cost**.

- The optimal route is visually presented on the frontend through an aesthetically designed React interface.


<h2 align="left">Project Video</h2>

- Presented here is a brief overview video of our project, providing insights into its some of the functionalities and design.

- Please take a moment to watch and gain an understanding of the project's offerings.


https://github.com/user-attachments/assets/3e3f0790-e8c5-4b8f-9fa2-cf58476503e9

<h2 align="left">Installation</h2>
<h3 align="center">To get started with this project, clone the repository or download the zip file.</h3>
<h4 align="center">Install the necessary dependencies</h4>
<h4 align="center">The NodeMCU Logic (Arduino File) is available in "Dustbin_Logic" Folder</h4>

```bash
# Clone the repository
git clone https://github.com/Rupesh2728/IoT-based-Smart-Dustbin-Management-System.git

# Navigate to the project directory
cd IoT-based-Smart-Dustbin-Management-System-main

# Install dependencies in Server
cd Server
npm install

# Run the code in Server
npm run watch

# Open new terminal and Install dependencies in Client
cd Client
npm install

# Run the code in Client
npm run dev
```
<h2 align="left">Project Images</h2>

![image](https://github.com/user-attachments/assets/1f6a0eb9-a36d-4638-8bac-eb2221e72b75)

![image](https://github.com/user-attachments/assets/a5a841af-0140-4e63-b179-6fe4099de660)

![image](https://github.com/user-attachments/assets/9f2872e5-5cca-41ff-b04b-efe0e580668c)

![image](https://github.com/user-attachments/assets/51add038-3ca2-4e07-92e2-9648afedbcba)


<h2 align="left">Fellow Team Members</h2>

- Rupesh Chowdary Peddineni 
- Saiteja Pagilla
- Rahul Pramod
- Sai Swetha

<h2 align="left">Contact Us</h2>

- 📫 You can to reach us by mailing to **rupesh.p21@iiits.in** or **rupeshprofessional2728@gmail.com**

- 👨‍💻 Project is available at [https://github.com/Rupesh2728/IoT-based-Smart-Dustbin-Management-System.git]
  
- 👨‍💻 Firebase A/c MailID : **rupesh.p21@iiits.in**
