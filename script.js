        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const chatContainer = document.getElementById('chat-container');
        const defaultView = document.getElementById('default-view');
        const themeToggle = document.getElementById('theme-toggle');
        const clearChat = document.getElementById('clear-chat');
        const newChatBtn = document.getElementById('new-chat-btn');

        let isTyping = false;

        // Predefined responses
        const responses = {
            "hello": `Hi, I’m Girish — developer, designer, and problem solver. Let me know how I can help!
        Type "About me" to know more about me, "Skills" for my abilities, "Projects" to explore my work, "Resume" to get my CV, "Certifications" for my licenses, and "Reviews" to see feedback from others.`,

            "hi": `Hi, I’m Girish — developer, designer, and problem solver. Let me know how I can help!
        Type "About me" to know more about me, "Skills" for my abilities, "Projects" to explore my work, "Resume" to get my CV, "Certifications" for my licenses, and "Reviews" to see feedback from others.`,

            "how are you": "I'm doing well, thank you for asking! How can I help you today?",
            "what is your name": "I'm ChatGPT, an AI assistant created by OpenAI. How can I help you?",
            "bye": "Goodbye! Have a wonderful day!",
            "goodbye": "See you later! Feel free to come back anytime.",
            "help": "I'm here to help! You can ask me about various topics, request explanations, or just have a conversation.",
            "what can you do": "I can help with answering questions, writing, analysis, math, coding, creative tasks, and much more. What would you like to explore?",
            "thanks": "You're welcome! Is there anything else I can help you with?",
            "thank you": "You're very welcome! Happy to help anytime.",

            // Custom Portfolio Commands
            "about me": `./asset/Images/Profile.jpeg I'm Girish Pawar, a software engineer and AI enthusiast currently pursuing my Master's in Artificial Intelligence and Machine Learning at the University of Adelaide. With a foundation in Electronics Engineering and hands-on experience as a Lead R&D Engineer, I specialize in building end-to-end software solutions — from cloud-based platforms and web applications to machine learning systems and IoT integrations — that solve complex, real-world problems.\n
            Connect with me on LinkedIn: https://www.linkedin.com/in/girish-pawar-1026a9129/`,

            "skills": `Tools: Power BI, MATLAB, TensorFlow, NumPy, Pandas, Git, Jira, Docker.
        Languages & Tech: Python, C++, Node.js, HTML, CSS, JavaScript, ReactJS, SQL, MongoDB, PostgreSQL, AWS, OpenCV.
        Expertise: Deep Learning, Machine Learning, LLMs, Data Science, Edge Computing with Jetson Orin, CUDA, and IoT platform development.`,

            "certifications": `Here are some of the certifications I’ve completed:
        - Microsoft: Introduction to Python
        - NVIDIA: Building Video AI Applications at Edge on Jetson Nano
        - Google: Introduction to Generative AI
        - Stanford University: Supervised Machine Learning (Regression & Classification)
        - Qlik Sense: Professional Dashboard Development`,

            "projects": `Some key projects I've worked on:
        - Bag Counting System using Jetson Orin & MobileNet SSD v2 (98.91% accuracy)
        - Bottle Classification using YOLOv3 (99.3% accuracy)
        - AGS Cloud: A real-time emissions monitoring platform processing data from 9,950+ IoT devices
        - Production Genie: Manufacturing analytics tool integrated with Power BI, Tableau & Qlik
        - Digital Image Correlation System for deformation analysis in MATLAB (Award-winning academic project)`,

            "resume": `You can download my latest resume from the resume section on this site or request it via email at girishpawar.connect@gmail.com.
        Also, feel free to view my LinkedIn: https://www.linkedin.com/in/girish-pawar-1026a9129/`,

            "contact me": `You can reach out to me at girishpawar.connect@gmail.com for any collaboration, opportunities, or queries. I usually respond within 24 hours!`,

            "reviews": "Check out the testimonials and reviews from colleagues, clients, and mentors who’ve worked with me. They reflect my dedication to solving problems with precision, creativity, and professionalism.",
        };




        // Initialize
        loadTheme();
        setupTextarea();

        // Event listeners
        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keydown', handleKeydown);
        themeToggle.addEventListener('click', toggleTheme);
        clearChat.addEventListener('click', clearChatHistory);
        newChatBtn.addEventListener('click', clearChatHistory);

        function handleSend() {
            const message = chatInput.value.trim();
            if (!message || isTyping) return;

            addMessage(message, 'user');
            chatInput.value = '';
            resizeTextarea();
            
            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    const response = getResponse(message);
                    addMessage(response, 'assistant');
                }, 1000 + Math.random() * 1000);
            }, 500);
        }

        function handleKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        }

function formatMessage(text) {
    const imageRegex = /((?:https?:\/\/|\.?\/)[^\s]+\.(?:png|jpg|jpeg|gif))/gi;
    let parts = text.split(imageRegex);

    for (let i = 0; i < parts.length; i++) {
        if (imageRegex.test(parts[i])) {
            parts[i] = `<br><img src="${parts[i]}" alt="Image" class="message-image">`;
        } else {
            parts[i] = parts[i]
                .replace(/(https?:\/\/[^\s<>"']+\b)/gi, `<a href="$1" target="_blank">$1</a>`)
                .replace(/\n/g, '<br>'); // 👈 Add this line to handle line breaks
        }
    }

    return parts.join('');
}




let activeUtterance = null;

function bindActions(messageContent) {
    const copyBtn = messageContent.querySelector('.copy-btn');
    const ttsBtn = messageContent.querySelector('.tts-btn');
    const likeBtn = messageContent.querySelector('.like-btn');
    const dislikeBtn = messageContent.querySelector('.dislike-btn');
    const text = messageContent.querySelector('.message-text').innerText;

    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✅';
            setTimeout(() => copyBtn.textContent = '📋', 1000);
        });
    });

    // TTS toggle functionality
    ttsBtn.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            ttsBtn.textContent = '🔊';
            activeUtterance = null;
        } else {
            activeUtterance = new SpeechSynthesisUtterance(text);
            activeUtterance.onend = () => {
                ttsBtn.textContent = '🔊';
                activeUtterance = null;
            };
            speechSynthesis.speak(activeUtterance);
            ttsBtn.textContent = '⏸️';
        }
    });

    // Like button toggle
    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('active');
        dislikeBtn.classList.remove('active');
    });

    // Dislike button toggle
    dislikeBtn.addEventListener('click', () => {
        dislikeBtn.classList.toggle('active');
        likeBtn.classList.remove('active');
    });
}


function addMessage(content, sender) {
    if (defaultView) {
        defaultView.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}-avatar`;
    avatar.textContent = sender === 'user' ? 'G' : 'AI';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (sender === 'assistant') {
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

    if (sender === 'user') {
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Event bindings for assistant messages
    if (sender === 'assistant') {
        bindActions(messageContent);
    }
}


        function showTyping() {
            if (isTyping) return;
            isTyping = true;

            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message assistant';
            typingDiv.id = 'typing-indicator';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar assistant-avatar';
            avatar.textContent = 'AI';
            
            const typingContent = document.createElement('div');
            typingContent.className = 'message-content';
            
            const typingAnimation = document.createElement('div');
            typingAnimation.className = 'typing-animation';
            typingAnimation.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            
            typingContent.appendChild(typingAnimation);
            typingDiv.appendChild(avatar);
            typingDiv.appendChild(typingContent);
            
            chatContainer.appendChild(typingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function hideTyping() {
            const typingIndicator = document.getElementById('typing-indicator');
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
                "That's an interesting question! While I don't have a specific answer for that, I'd be happy to help you explore the topic further.",
                "I understand you're asking about that topic. Could you provide a bit more context so I can give you a more helpful response?",
                "That's a great question! I'd love to help you with that. Could you tell me more about what specific aspect you're most interested in?",
                "I appreciate your question! While I may not have all the details on that particular topic, I'm here to help however I can."
            ];
            
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        function setupTextarea() {
            chatInput.addEventListener('input', resizeTextarea);
        }

        function resizeTextarea() {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 200) + 'px';
        }

        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggle.querySelector('.material-symbols-rounded').textContent = isLight ? 'dark_mode' : 'light_mode';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                themeToggle.querySelector('.material-symbols-rounded').textContent = 'dark_mode';
            }
        }

        function clearChatHistory() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                chatContainer.innerHTML = `
                    <div class="default-view" id="default-view">
                        <h1>What's on your mind today?</h1>
                        <p>Start a conversation and know more about me.<br>Initiate the conversation with Hello.</p>
                    </div>
                `;
            }
        }

        // Mobile menu toggle
        const menuBtn = document.querySelector('.chat-title .material-symbols-rounded');
        const sidebar = document.getElementById('sidebar');
        
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener("DOMContentLoaded", function () {
            const sidebar = document.getElementById("sidebar");
            const sidebarToggle = document.getElementById("sidebar-toggle");

            sidebarToggle.addEventListener("click", () => {
                if (window.innerWidth <= 768) {
                sidebar.classList.toggle("open");
                } else {
                sidebar.classList.toggle("collapsed");
                }
            });
        });

        