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
    const user = "prakalpsingh16"; 
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