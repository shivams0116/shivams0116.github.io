# Java Developer Portfolio

A modern, animated portfolio website for a Java Developer with 5 years of experience.

## 🚀 Features

- **Animated Hero Section** with typing effects and code snippets
- **Skills Section** with animated progress bars
- **5 Featured Projects** with descriptions and technologies
- **Contact Form** with validation
- **Fully Responsive Design** for all devices
- **Smooth Scroll Animations**
- **Floating Particles Background Effect**

## 🛠️ Technologies Used

- HTML5
- CSS3 (with animations and transitions)
- JavaScript (vanilla)
- Google Fonts (Poppins)

## 📦 Deployment to GitHub Pages

### Method 1: Direct Upload

1. Create a new repository on GitHub
2. Upload the following files:
   - `index.html`
   - `styles.css`
   - `script.js`

3. Go to **Settings** → **Pages**
4. Under **Source**, select **main** branch
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/repository-name`

### Method 2: Using Git

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Make your changes
# Edit index.html to update your information

# Add and commit changes
git add .
git commit -m "Update portfolio"

# Push to GitHub
git push origin main

# Enable GitHub Pages in repository settings
```

### Method 3: Using GitHub Actions (Automatic Deploy)

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 📁 Project Structure

```
portfolio/
├── index.html      # Main HTML file
├── styles.css      # CSS styles with animations
├── script.js       # JavaScript for interactivity
├── README.md       # This file
└── .nojekyll       # GitHub Pages configuration
```

## 🎨 Customization

### Update Your Information

Edit `index.html` and replace:
- Your name in the hero section
- Your experience details
- Your projects information
- Contact details

### Change Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #f39c12;  /* Change this to your preferred color */
    --secondary-color: #2c3e50;
    --bg-color: #1a1a2e;
    /* ... more variables */
}
```

### Add/Remove Projects

In `index.html`, copy/paste the project card section:

```html
<div class="project-card">
    <div class="project-icon">🏷️</div>
    <h3 class="project-title">Your Project Name</h3>
    <p class="project-description">Project description...</p>
    <div class="project-tech">
        <span>Technology</span>
        <span>Another Tech</span>
    </div>
    <div class="project-links">
        <a href="#" class="project-link">View Code</a>
        <a href="#" class="project-link">Live Demo</a>
    </div>
</div>
```

## 📱 Responsive Design

The portfolio is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## ✨ Animations Included

- Fade-in on scroll
- Skill bar animations
- Number counter animations
- Hover effects on cards
- Typing effect for hero text
- Floating particles background
- Smooth scroll navigation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

---

Built with ❤️ and Java ☕
