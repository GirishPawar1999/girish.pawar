/* =========================================================
   Girish Pawar — Portfolio chatbot logic
   ========================================================= */

// ----- DOM references (guarded — not every element exists on every page) -----
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatContainer = document.getElementById("chat-container");
const defaultView = document.getElementById("default-view");
const themeToggle = document.getElementById("theme-toggle");
const clearChat = document.getElementById("clear-chat");
const newChatBtn = document.getElementById("new-chat-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

let isTyping = false;

// ----- Predefined responses -----
const responses = {
  hello: `Hi, I'm Girish — developer, designer, and problem solver. Let me know how I can help!<br><br>
        Type "About me" to know more about me<br>Type "Skills" for my abilities<br>Type "Projects" to explore my work<br>Type "Resume" to get my CV<br>Type "Certifications" for my licenses<br>Type "Contact me" to get in touch.<br><br>
        NOTE: You can also access all of this from the menu on the left if you'd rather skip the chat.`,

  hi: `Hi, I'm Girish — developer, designer, and problem solver. Let me know how I can help!<br>
        Type "About me" to know more about me, "Skills" for my abilities, "Projects" to explore my work, "Resume" to get my CV, "Certifications" for my licenses, or "Contact me" to get in touch.`,

  "how are you":
    "I'm doing well, thank you for asking! How can I help you today?",
  "what is your name":
    "I'm Girish's portfolio assistant — a lightweight chatbot built to help you explore his work. Ask me about his projects, skills, experience, or resume!",
  bye: "Goodbye! Have a wonderful day!",
  goodbye: "See you later! Feel free to come back anytime.",
  help: "I'm here to help! Try asking about my background, skills, projects, resume, certifications, or how to get in touch.",
  "what can you do":
    "I can tell you about Girish's background, skills, projects, resume, and certifications — or point you to the right page. What would you like to explore?",
  thanks: "You're welcome! Is there anything else I can help you with?",
  "thank you": "You're very welcome! Happy to help anytime.",

  // Custom Portfolio Commands
  "about me": `./asset/Images/Profile.jpeg I'm Girish Pawar, a Software Engineer with 3+ years of experience building backend, cloud-native, and applied-ML systems in production, currently completing an M.S. in AI/ML at the University of Adelaide (Distinction average). I specialize in building end-to-end software solutions — from containerized microservices and cloud platforms to computer-vision pipelines and LLM-powered tools — that solve real-world problems.<br><br>
            Connect with me on <a href="https://www.linkedin.com/in/girish-pawar-1026a9129/" target="_blank" rel="noopener">LinkedIn</a> or check out the <a href="aboutme.html">full About Me page</a>.`,

  skills: `Languages: Python, JavaScript (ES6+), C++ (Embedded/IoT), SQL<br>
        Frontend: React, HTML5, CSS3<br>
        Backend & APIs: Node.js, Express, REST APIs, OAuth 2.0, NGINX<br>
        Cloud & Infra: AWS, Docker, Kubernetes, Kafka, CI/CD, PostgreSQL, MongoDB<br>
        AI/ML: LLMs, RAG, HuggingFace Transformers, TensorFlow, Computer Vision (OpenCV), NumPy, Pandas, CUDA`,

  certifications: `Here are some of my certifications:<br>
        - AWS Cloud Practitioner Essentials — Udemy, 2026 (pursuing the official AWS Certified Cloud Practitioner exam)<br>
        - Google Cloud Developer — GCP Professional Certification<br><br>
        See the full list on the <a href="aboutme.html">About Me page</a>.`,

  projects: `Some key projects I've worked on:<br>
        - NEXUS Multi-Agent RAG Platform — a 4-agent RAG system for enterprise document search (Capstone, Development Lead)<br>
        - Production Genie — multi-tenant manufacturing analytics platform with an LLM-based report generator<br>
        - GM-AI-L Manager — an offline, privacy-first AI email client with local summarization and smart replies<br>
        - Enterprise computer-vision pipelines on Jetson Orin (98.9%–99.3% accuracy)<br><br>
        Check out the full write-ups here: <a href="projects.html">View All Projects →</a>`,

  resume: `You can grab my latest resume right here:<br><a href="asset/resume.pdf" download class="chat-download-btn"><span class="material-symbols-rounded">download</span> Download Resume (PDF)</a><br><br>Or connect with me on <a href="https://www.linkedin.com/in/girish-pawar-1026a9129/" target="_blank" rel="noopener">LinkedIn</a>.`,

  "contact me": `You can reach out to me at <a href="mailto:girishpawar.connect@gmail.com">girishpawar.connect@gmail.com</a> or 0406 825 150 for any collaboration, opportunities, or queries. I usually respond within 24 hours! You can also use the <a href="contact.html">contact form</a>.`,

  reviews:
    "Check out the testimonials and reviews from colleagues, clients, and mentors who've worked with me. They reflect my dedication to solving problems with precision, creativity, and professionalism.",
};

// ----- Init -----
loadTheme();
setupTextarea();
setupSidebarToggle();
setupUploadControl();

// ----- Event listeners (all guarded) -----
if (sendBtn) sendBtn.addEventListener("click", handleSend);
if (chatInput) chatInput.addEventListener("keydown", handleKeydown);
if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
if (clearChat) clearChat.addEventListener("click", clearChatHistory);
if (newChatBtn) newChatBtn.addEventListener("click", clearChatHistory);

function handleSend() {
  if (!chatInput) return;
  const message = chatInput.value.trim();
  if (!message || isTyping) return;

  // Chat thread only lives on the home page. If we're on another page,
  // hand the message off to index.html instead of silently failing.
  if (!chatContainer) {
    try {
      sessionStorage.setItem("pendingMessage", message);
    } catch (e) {
      /* sessionStorage unavailable — ignore, index.html will just show the greeting */
    }
    window.location.href = "index.html";
    return;
  }

  chatInput.value = "";
  resizeTextarea();
  sendSimulated(message);
}

function sendSimulated(message) {
  addMessage(message, "user");
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      const response = getResponse(message);
      addMessage(response, "assistant");
    }, 900 + Math.random() * 700);
  }, 400);
}

function handleKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function formatMessage(text) {
  const imageRegex = /((?:https?:\/\/|\.?\/)[^\s]+\.(?:png|jpg|jpeg|gif))/gi;
  let parts = text.split(imageRegex);

  for (let i = 0; i < parts.length; i++) {
    if (imageRegex.test(parts[i])) {
      parts[
        i
      ] = `<br><img src="${parts[i]}" alt="Image" class="message-image">`;
    } else if (/<a[\s>]/i.test(parts[i])) {
      // This chunk already contains hand-authored links/buttons (e.g. the
      // resume download button) — don't run auto-link over it or we'd
      // wrap an <a> inside another <a>. Just normalize line breaks.
      parts[i] = parts[i].replace(/\n/g, "<br>");
    } else {
      parts[i] = parts[i]
        .replace(
          /(https?:\/\/[^\s<>"']+\b)/gi,
          `<a href="$1" target="_blank" rel="noopener">$1</a>`
        )
        .replace(/\n/g, "<br>");
    }
  }

  return parts.join("");
}

let activeUtterance = null;

function bindActions(messageContent) {
  const copyBtn = messageContent.querySelector(".copy-btn");
  const ttsBtn = messageContent.querySelector(".tts-btn");
  const likeBtn = messageContent.querySelector(".like-btn");
  const dislikeBtn = messageContent.querySelector(".dislike-btn");
  const text = messageContent.querySelector(".message-text").innerText;

  // Copy button functionality
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "✅";
      setTimeout(() => (copyBtn.textContent = "📋"), 1000);
    });
  });

  // TTS toggle functionality
  ttsBtn.addEventListener("click", () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      ttsBtn.textContent = "🔊";
      activeUtterance = null;
    } else {
      activeUtterance = new SpeechSynthesisUtterance(text);
      activeUtterance.onend = () => {
        ttsBtn.textContent = "🔊";
        activeUtterance = null;
      };
      speechSynthesis.speak(activeUtterance);
      ttsBtn.textContent = "⏸️";
    }
  });

  // Like button toggle
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("active");
    dislikeBtn.classList.remove("active");
  });

  // Dislike button toggle
  dislikeBtn.addEventListener("click", () => {
    dislikeBtn.classList.toggle("active");
    likeBtn.classList.remove("active");
  });
}

function addMessage(content, sender) {
  if (!chatContainer) return; // safety net — chat thread only exists on index.html

  if (defaultView) {
    defaultView.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = `message-avatar ${sender}-avatar`;
  avatar.textContent = sender === "user" ? "G" : "AI";

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";

  if (sender === "assistant") {
    // Format HTML with action buttons
    messageContent.innerHTML = `
            <div class="message-text">${formatMessage(content)}</div>
            <div class="message-actions">
                <button class="action-btn copy-btn" title="Copy">📋</button>
                <button class="action-btn tts-btn" title="Read Aloud">🔊</button>
                <button class="action-btn like-btn" title="Like">👍</button>
                <button class="action-btn dislike-btn" title="Dislike">👎</button>
            </div>
        `;
  } else {
    messageContent.textContent = content;
  }

  if (sender === "user") {
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(avatar);
  } else {
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
  }

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Event bindings for assistant messages
  if (sender === "assistant") {
    bindActions(messageContent);
  }
}

function showTyping() {
  if (!chatContainer || isTyping) return;
  isTyping = true;

  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message assistant";
  typingDiv.id = "typing-indicator";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar assistant-avatar";
  avatar.textContent = "AI";

  const typingContent = document.createElement("div");
  typingContent.className = "message-content";

  const typingAnimation = document.createElement("div");
  typingAnimation.className = "typing-animation";
  typingAnimation.innerHTML =
    '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

  typingContent.appendChild(typingAnimation);
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(typingContent);

  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTyping() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
  isTyping = false;
}

function getResponse(message) {
  const normalizedMessage = message.toLowerCase().trim();

  // Check for exact matches first
  if (responses[normalizedMessage]) {
    return responses[normalizedMessage];
  }

  // Check for partial matches
  for (const key in responses) {
    if (normalizedMessage.includes(key)) {
      return responses[key];
    }
  }

  // Default responses for unknown queries
  const defaultResponses = [
    "That's an interesting question! While I don't have a specific answer for that, try asking about my background, skills, projects, resume, or how to get in touch.",
    "I understand you're asking about that topic. Could you provide a bit more context, or try one of: About me, Skills, Projects, Resume, Certifications, Contact me?",
    "That's a great question! I'd love to help you with that. Could you tell me more about what specific aspect you're most interested in?",
    "I appreciate your question! While I may not have all the details on that particular topic, I'm here to help however I can.",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function setupTextarea() {
  if (!chatInput) return;
  chatInput.addEventListener("input", resizeTextarea);
}

function resizeTextarea() {
  if (!chatInput) return;
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 200) + "px";
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  themeToggle.querySelector(".material-symbols-rounded").textContent = isLight
    ? "dark_mode"
    : "light_mode";
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) {
      themeToggle.querySelector(".material-symbols-rounded").textContent =
        "dark_mode";
    }
  }
}

function clearChatHistory() {
  if (!chatContainer) {
    // Nothing to clear on this page — just send the user to a fresh chat.
    window.location.href = "index.html";
    return;
  }
  if (confirm("Are you sure you want to clear the chat history?")) {
    chatContainer.innerHTML = `
                    <div class="default-view" id="default-view">
                        <h1>What's on your mind today?</h1>
                        <p>Start a conversation and know more about me.<br>Initiate the conversation with Hello.</p>
                    </div>
                `;
  }
}

// ----- Sidebar toggle (single source of truth — no duplicate listeners) -----
function setupSidebarToggle() {
  if (!sidebar || !sidebarToggle) return;

  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("open");
    } else {
      sidebar.classList.toggle("collapsed");
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768) return;
    const isClickInside =
      sidebar.contains(event.target) || sidebarToggle.contains(event.target);
    if (!isClickInside && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  });
}

// ----- File attach button (was previously wired to nothing) -----
function setupUploadControl() {
  if (!uploadBtn || !fileInput) return;

  uploadBtn.addEventListener("click", () => {
    if (!chatContainer) {
      window.location.href = "index.html";
      return;
    }
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    sendSimulatedUpload(file.name);
    fileInput.value = "";
  });
}

function sendSimulatedUpload(fileName) {
  addMessage(`📎 Uploaded: ${fileName}`, "user");
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage(
        `Thanks for sharing "${fileName}"! This demo assistant can't read file contents yet, but feel free to email it to me directly at <a href="mailto:girishpawar.connect@gmail.com">girishpawar.connect@gmail.com</a>.`,
        "assistant"
      );
    }, 900);
  }, 400);
}

// ----- Kick off the chat thread on the home page only -----
document.addEventListener("DOMContentLoaded", function () {
  if (!chatContainer) return; // About/Contact/Projects pages don't host a chat thread

  let pending = null;
  try {
    pending = sessionStorage.getItem("pendingMessage");
    if (pending) sessionStorage.removeItem("pendingMessage");
  } catch (e) {
    /* ignore */
  }

  if (pending) {
    setTimeout(() => sendSimulated(pending), 400);
  } else {
    setTimeout(() => sendSimulated("hello"), 1500);
  }
});

// ------------------ LOAD PROJECTS FROM TXT FILE ------------------
async function loadProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return; // Only run on pages that have a project container

  try {
    const response = await fetch("projects.txt");
    const text = await response.text();

    const lines = text.split("\n").filter((line) => line.trim() !== "");

    container.innerHTML = ""; // Clear "loading..."

    lines.forEach((line) => {
      const [title, description, tags, link] = line
        .split("|")
        .map((x) => x.trim());

      const card = document.createElement("div");
      card.className = "tech-card project-card";

      const hasLink = link && link !== "#" && link.length > 0;

      card.innerHTML = `
                <h4>📌 ${title}</h4>
                <p>${description}</p>

                <div class="project-tags">
                    ${tags
                      .split(",")
                      .map((tag) => `<span class="tag">${tag.trim()}</span>`)
                      .join("")}
                </div>

                ${
                  hasLink
                    ? `<div class="project-link-row">
                    <a href="${link}" target="_blank" rel="noopener" class="project-link">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="Repository link">
                    </a>
                </div>`
                    : ""
                }
            `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>Failed to load projects.</p>";
    console.error("Error loading projects:", error);
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", loadProjects);

// ------------------ VISITOR COUNTER ------------------
// Previously this fetch lived in an inline <script> tag that ran on every
// page, sometimes BEFORE the #visit-count span existed in the DOM. Running
// it after DOMContentLoaded guarantees the element is there.
function loadVisitorCount() {
  const visitCountEl = document.getElementById("visit-count");
  if (!visitCountEl) return;

  fetch(
    "https://script.google.com/macros/s/AKfycbwrx_kWwmOkq45ctGSNKriYm5B2rt5CJ5uOyTXf9SYagiYll6KXUbK3SgNwl81wIenm/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      visitCountEl.innerText = data.count;
    })
    .catch(() => {
      visitCountEl.innerText = "Unavailable";
    });
}

document.addEventListener("DOMContentLoaded", loadVisitorCount);
