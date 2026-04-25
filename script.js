document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const analyzeBtn = document.querySelector(".analyze-btn");
    const inputField = document.querySelector(".glow-input");
    const analyzerBox = document.querySelector(".analyzer-box");
    const themeToggle = document.getElementById("themeToggle");
    const tabBtns = document.querySelectorAll(".tab-btn");

    // 1. Theme Toggle Logic
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
    });

    // 2. Tab Switcher Logic
    tabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            
            // FUTURE FEATURE ALERT FOR URL TAB
            if (e.target.innerText === "URL") {
                alert("🚀 Future Feature! URL web-scraping is currently in development. For now, please paste the Article Text directly.");
                return; // Stop here, don't switch tabs
            }

            // Remove active class from all
            tabBtns.forEach(t => t.classList.remove("active"));
            // Add active class to clicked
            e.target.classList.add("active");
            
            inputField.placeholder = "Paste the article text here...";
            inputField.value = ""; // Clear input on switch
        });
    });

    // 3. Analyze Content Logic
    analyzeBtn.addEventListener("click", async () => {
        const input = inputField.value.trim();

        if (!input) {
            alert("Please enter some text to analyze.");
            return;
        }

        // Save original button state and show loading
        const originalBtnHTML = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = `<div class="btn-shimmer"></div> Analyzing...`;
        analyzeBtn.style.pointerEvents = "none";

        try {
            // Call the Flask Backend
            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: input })
            });

            const data = await response.json();

            // Create or grab the Result Box
            let resultBox = document.getElementById("resultBox");
            if (!resultBox) {
                resultBox = document.createElement("div");
                resultBox.id = "resultBox";
                // Style to match your theme
                resultBox.style.marginTop = "24px";
                resultBox.style.padding = "20px";
                resultBox.style.borderRadius = "12px";
                resultBox.style.background = "var(--surface)";
                resultBox.style.border = "1px solid var(--border)";
                resultBox.style.animation = "fadeUp 0.5s ease forwards";
                analyzerBox.appendChild(resultBox);
            }

            // Determine colors based on Result
            const isFake = data.result === "FAKE";
            const resultColor = isFake ? "var(--danger)" : "var(--accent)";
            const icon = isFake ? "⚠️" : "✅";

            // Inject the result HTML
            resultBox.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">${icon}</div>
                    <h3 style="color: ${resultColor}; font-family: var(--font-head); font-size: 28px; margin-bottom: 8px;">
                        ${data.result} NEWS
                    </h3>
                    <p style="color: var(--text-muted); font-size: 14px;">
                        Model Confidence: <strong style="color: var(--text); font-size: 16px;">${data.confidence}%</strong>
                    </p>
                </div>
            `;
            
            // Highlight the border based on the result
            resultBox.style.borderColor = resultColor;

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the analysis engine. Is the Flask server running?");
        } finally {
            // Restore button state
            analyzeBtn.innerHTML = originalBtnHTML;
            analyzeBtn.style.pointerEvents = "auto";
        }
    });
});
