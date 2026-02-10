// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyBngz0PLbI435djJMoSA1j-5oQvrcBhhv0",
  authDomain: "resume-portfolio-ad60c.firebaseapp.com",
  projectId: "resume-portfolio-ad60c",
  storageBucket: "resume-portfolio-ad60c.firebasestorage.app",
  messagingSenderId: "747608762750",
  appId: "1:747608762750:web:68b1e3e35198a73c03ab2f",
  measurementId: "G-7KPR06VC51"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- FEATURE 1: GITHUB API (Used in projects.html) ---
async function fetchGithub() {
    const user = "prakalpsingh999-netizen"; 
    const repoList = document.getElementById('repo-list');
    if (!repoList) return;

    try {
        const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated`);
        const data = await response.json();
        repoList.innerHTML = data.slice(0, 4).map(repo => `
            <div class="card-mini" style="border-left: 4px solid var(--sea-green); margin-bottom: 10px; padding: 15px; background: #fff; box-shadow: var(--shadow);">
                <h4>${repo.name}</h4>
                <p style="font-size: 0.8rem; color: #666;">Main Language: ${repo.language || 'N/A'}</p>
                <a href="${repo.html_url}" target="_blank" style="color: var(--sea-green); text-decoration: none;">View Source Code</a>
            </div>
        `).join('');
    } catch (error) {
        repoList.innerHTML = "<p>Unable to fetch live data. Please check connection.</p>";
    }
}
fetchGithub();

// --- FEATURE 2: FIREBASE SYNC (Used in contact.html) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.querySelector('.glow-button');
        submitBtn.innerText = "Syncing with Cloud...";

        try {
            await db.collection("inquiries").add({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                submittedAt: new Date()
            });
            alert("Success! Your message is saved in the Database.");
            contactForm.reset();
            submitBtn.innerText = "Push to Cloud Database";
        } catch (error) {
            alert("Database Error. Please verify Firebase credentials.");
            submitBtn.innerText = "Retry Sync";
        }
    });
}
async function getLiveProjects() {
    const username = "prakalpsingh999-netizen"; // Your GitHub ID [cite: 35]
    const repoContainer = document.getElementById('repo-feed');

    try {
        // Step 1: Request the data
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        
        // Step 2: Convert response to a list (JSON)
        const repos = await response.json();

        // Step 3: Clear the 'loading' message
        repoContainer.innerHTML = '';

        // Step 4: Map through the first 4 projects and create Tiles
        repos.slice(0, 4).forEach(repo => {
            const card = document.createElement('div');
            card.className = 'mini-tile'; // Matches your shadow styling
            
            card.innerHTML = `
                <h4 style="color: #20B2AA; margin-bottom: 5px;">${repo.name}</h4>
                <p style="font-size: 0.85rem; color: #64748b;">${repo.description || 'Professional Engineering Project'}</p>
                <div class="repo-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.language || 'Data'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View Source Code</a>
            `;
            repoContainer.appendChild(card);
        });
    } catch (error) {
        repoContainer.innerHTML = "<p>Error connecting to API. Verify GitHub username.</p>";
    }
}

// Call the function when the page loads
getLiveProjects();
