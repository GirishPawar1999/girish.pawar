# 🧠 Girish Pawar - Personal Portfolio Website

Welcome to the source code of my personal portfolio website!  
Live Link 👉 [https://girishpawar1999.github.io/girish.pawar/](https://girishpawar1999.github.io/girish.pawar/)

---

## 🚀 About the Project

This portfolio is more than a personal website — it's a reflection of my journey, passion, and evolving skills in the field of Artificial Intelligence, Machine Learning, and Data Engineering.

As an AI/ML student, my focus lies at the intersection of:  
- 🤖 Large Language Models (LLMs)  
- ⚙️ MLOps and Deployment  
- ☁️ Cloud Computing (Azure/GCP)  
- 📊 Intelligent Data Pipelines  

---

## 🎨 Design Inspiration

The UI/UX of this website draws inspiration from **OpenAI’s ChatGPT interface**.  
I wanted the experience to feel minimal, responsive, and interactive — just like modern conversational AI tools.

---

## 📁 Project Structure

├── index.html # Homepage
├── aboutme.html # About Me section
├── contact.html # Contact form with EmailJS integration
├── assets/
│ ├── Images/ # GIFs and visual content
│ └── resume.pdf # Downloadable resume
├── style.css # Core styling
├── script.js # JavaScript interactions
└── README.md # This file

yaml
Copy
Edit

---

## ✉️ Features

- 📄 Downloadable Resume  
- 📬 Contact form with **EmailJS integration**  
- 🎞️ Animated visuals using **Lottie** or **GIFs**  
- 🔄 Theme toggling support (Light/Dark)  
- 📱 Fully responsive design
- 📄 Visitors Count

---
## 📌 How to add visitors count
- Create a google sheet name it as "Visitor's count"
- A0 Cell Type Counts, A1 cell Type 0
- Go to Extensions->App Script
- Paste the following code
```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const countCell = sheet.getRange("A2");
  let count = countCell.getValue();

  // Increment count by 1
  count++;

  // Save the new count
  countCell.setValue(count);

  // Prepare JSON response
  const output = ContentService.createTextOutput(JSON.stringify({ count: count }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
-Go to Deploy-> New Deployment -> Make the Access to ANYONE
- Replace the Webapp URL with yours
- And You have Visitors Count :)
## 🛠️ Tech Stack

- **HTML5 / CSS3 / JavaScript**  
- [EmailJS](https://www.emailjs.com/) for contact form  
- Responsive Design with media queries  
- Hosted on **GitHub Pages**  

---

## 📌 To Run Locally

1. Clone this repository:

```bash
Note: Ask for permission before, you copy the file :)
git clone https://github.com/girishpawar1999/girish.pawar.git
cd girish.pawar
Open index.html in your browser (no backend setup needed).

(Optional) Replace EmailJS service_id, template_id, and public_key with your own credentials in the JavaScript file to activate the contact form.

💡 Future Enhancements
Add blog/articles section

Integrate backend for advanced contact analytics

Live chat or AI chatbot integration

Unique Visitors count

📫 Let's Connect!
💼 LinkedIn

📬 girishpawar1999@gmail.com

📝 License
This project is licensed under the MIT License.

👋 Thanks for checking it out!
If you like this project, feel free to ⭐ the repo and connect!
