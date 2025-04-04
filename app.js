const QUESTIONS = [
    {
        text: "How effectively does your organization identify and articulate key business challenges?",
        scale: "A",
    },
    {
        text: "How often does your team refine and reframe problems before jumping to solutions?",
        scale: "B",
    },
    {
        text: "How frequently does your organization involve diverse stakeholders in problem-identification processes?",
        scale: "B",
    },
    {
        text: "To what degree does your company encourage cross-functional collaboration when defining problems?",
        scale: "B",
    },
    {
        text: "How effectively does your organization engage with customers or end-users to understand their pain points?",
        scale: "A",
    },
    {
        text: "How often does your team conduct field research or ethnographic studies to observe problems firsthand?",
        scale: "B",
    },
    {
        text: "To what extent does your organization utilize data analytics to identify emerging challenges?",
        scale: "B",
    },
    {
        text: "How effectively does your company leverage customer feedback channels to spot potential problems?",
        scale: "A",
    },
];

const SCALES = {
    A: ["Very Poorly", "Poorly", "Neutral", "Well", "Excellently Well"],
    B: ["Not Likely", "Slightly Likely", "Neutral", "Likely", "Always"],
};

let scoreChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questionsContainer');
    QUESTIONS.forEach((question, index) => {
        const scale = SCALES[question.scale];
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        
        questionDiv.innerHTML = `
            <div class="question-text">${index + 1}. ${question.text}</div>
            <div class="options-container">
                ${scale.map((label, i) => `
                    <div class="option-group">
                        <label>
                            <input type="radio" name="q${index}" value="${i + 1}" required>
                            ${label}
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });
});

function calculateScores(results) {
    const scores = Object.values(results);
    return {
        total: scores.reduce((a, b) => a + b, 0),
        average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
        category: '',
        feedback: ''
    };
}

function getPerformanceCategory(score) {
    if (score.total < 15) return 'Beginner';
    if (score.total <= 30) return 'Intermediate';
    return 'Advanced';
}

function createChart(results) {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const labels = QUESTIONS.map(q => q.text);
    const data = Object.values(results);

    if (scoreChart) {
        scoreChart.destroy();
        scoreChart = null;
    }

    // Update chart configuration in createChart function
    scoreChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance Score',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        color: '#7f8c8d',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(127, 140, 141, 0.2)'
                    },
                    pointLabels: {
                        color: '#2c3e50',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

function createPerformanceSummary(score) {
    const summary = document.getElementById('performanceSummary');
    const feedbackTexts = {
        Beginner: "Your organization is in the early stages of innovation maturity. Focus on building foundational problem-solving capabilities.",
        Intermediate: "You have established some innovation practices. Look to strengthen cross-functional collaboration and data-driven insights.",
        Advanced: "Your organization demonstrates strong innovation capabilities. Continue optimizing and scaling best practices."
    };

    summary.innerHTML = `
        <h3>Innovation Score: ${score.total}/40</h3>
        <p><strong>Average Score:</strong> ${score.average}/5</p>
        <p><strong>Category:</strong> ${score.category}</p>
        <p>${feedbackTexts[score.category]}</p>
    `;
}

document.getElementById('surveyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const results = {};
    
    QUESTIONS.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        results[question.text] = selected ? parseInt(selected.value) : 0;
    });

    const score = calculateScores(results);
    score.category = getPerformanceCategory(score);

    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('surveyForm').style.display = 'none';

    createChart(results);
    createPerformanceSummary(score);
});