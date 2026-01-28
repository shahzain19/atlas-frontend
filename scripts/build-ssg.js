import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://atlas-backend-npbs.vercel.app/api';
const DIST_DIR = path.resolve(__dirname, '../dist');

// Categories with their metadata
const categories = [
  { path: '/', category: 'money', title: 'Sovereign Finance', subtitle: 'Understanding the flow of value and the mechanics of debt.' },
  { path: '/money', category: 'money', title: 'Sovereign Finance', subtitle: 'Understanding the flow of value and the mechanics of debt.' },
  { path: '/business', category: 'business', title: 'Systemic Leverage', subtitle: 'Building scalable operations and understanding incentives.' },
  { path: '/intelligence', category: 'intelligence', title: 'Strategic Foresight', subtitle: 'Gathering and analyzing data to build actionable intelligence.' },
  { path: '/technology', category: 'technology', title: 'Technological Sovereignty', subtitle: 'Navigating the stack: from base protocols to biological engineering.' },
  { path: '/health', category: 'health', title: 'Biological Resilience', subtitle: 'Optimizing the human hardware for longevity and performance.' },
  { path: '/politics', category: 'politics', title: 'Sovereign Governance', subtitle: 'Analyzing the structures of power, laws, and systemic control.' },
  { path: '/logistics', category: 'logistics', title: 'Physical Reality', subtitle: 'Understanding supply chains, energy, and the mechanics of movement.' },
  { path: '/security', category: 'security', title: 'Defensive Protocols', subtitle: 'Hardening the perimeter: physical security and digital encryption.' },
  { path: '/energy', category: 'energy', title: 'Systemic Power', subtitle: 'Analyzing energy production, thermodynamics, and resource sovereignty.' },
  { path: '/science', category: 'science', title: 'First Principles', subtitle: 'Exploring the fundamental laws of nature and the scientific method.' },
  { path: '/history', category: 'history', title: 'Pattern Recognition', subtitle: 'Decoding the past to identify recurring systemic cycles.' },
  { path: '/philosophy', category: 'philosophy', title: 'Axiomatic Logic', subtitle: 'Foundations of reasoning, ethical frameworks, and the search for truth.' },
  { path: '/law', category: 'law', title: 'Systemic Codes', subtitle: 'Navigating legal structures, contracts, and jurisdictional resilience.' },
  { path: '/psychology', category: 'psychology', title: 'Cognitive OS', subtitle: 'Understanding the human operating system and behavioral patterns.' },
  { path: '/environment', category: 'environment', title: 'Ecological Sovereignty', subtitle: 'Sustaining the habitat and managing natural assets for the long term.' },
  { path: '/strategy', category: 'strategy', title: 'Game Theory', subtitle: 'Analyzing incentives, competition, and optimal decision-making.' },
  { path: '/economics', category: 'economics', title: 'Universal Incentives', subtitle: 'Deciphering the allocation of scarce resources and human behavior.' },
  { path: '/geopolitics', category: 'geopolitics', title: 'Global Statics', subtitle: 'Mapping the intersection of geography, power, and statecraft.' },
  { path: '/engineering', category: 'engineering', title: 'Physical Syntax', subtitle: 'Building the systems and structures that command the physical world.' },
  { path: '/agriculture', category: 'agriculture', title: 'Basal Layer', subtitle: 'Securing the food supply and understanding biological production.' },
  { path: '/architecture', category: 'architecture', title: 'Physical Environment', subtitle: 'Designing the structures and spaces that shape human experience.' },
  { path: '/media', category: 'media', title: 'Signal Intelligence', subtitle: 'Navigating the ocean of information, propaganda, and truth.' },
  { path: '/education', category: 'education', title: 'Knowledge Transfer', subtitle: 'Optimizing the systems for acquiring and sharing systemic intelligence.' },
  { path: '/culture', category: 'culture', title: 'Narrative Control', subtitle: 'Analyzing the stories and signals that shape collective reality.' },
];

// Read the base index.html template
const indexTemplate = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

// Function to generate category page HTML
function generateCategoryHTML(category, title, subtitle) {
  return indexTemplate.replace(
    '<title>Atlas Blog — Deep Research, Analysis & Knowledge Systems</title>',
    `<title>Atlas ${title} — ${category.charAt(0).toUpperCase() + category.slice(1)} Research & Analysis</title>`
  ).replace(
    '<meta name="description" content="Atlas publishes in-depth articles on technology, systems thinking, history, economics, psychology, geopolitics, and real-world research. Clean, readable, fast knowledge for serious thinkers. Explore cognitive frameworks, decision-making strategies, and first-principles reasoning." />',
    `<meta name="description" content="${subtitle} Explore ${category} research, analysis, and insights on Atlas. ${title} articles covering systems thinking, strategic analysis, and actionable intelligence." />`
  );
}

// Function to generate article HTML with content
async function generateArticleHTML(article) {
  const articleTitle = `${article.title} — Atlas ${article.category.charAt(0).toUpperCase() + article.category.slice(1)} Research`;
  const articleDescription = article.body.substring(0, 160).replace(/[#*`]/g, '').trim();
  
  // Create structured data for the article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": articleDescription,
    "author": {
      "@type": "Person",
      "name": article.author_name || "Atlas Contributor"
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://atlas-frontend-omega.vercel.app/read/${article.id}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atlas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://atlas-frontend-omega.vercel.app/og-image.png"
      }
    },
    "articleSection": article.category,
    "keywords": article.tags ? article.tags.map(t => t.name).join(", ") : ""
  };

  return indexTemplate
    .replace(
      '<title>Atlas Blog — Deep Research, Analysis & Knowledge Systems</title>',
      `<title>${articleTitle}</title>`
    )
    .replace(
      '<meta name="description" content="Atlas publishes in-depth articles on technology, systems thinking, history, economics, psychology, geopolitics, and real-world research. Clean, readable, fast knowledge for serious thinkers. Explore cognitive frameworks, decision-making strategies, and first-principles reasoning." />',
      `<meta name="description" content="${articleDescription}" />`
    )
    .replace(
      '<meta property="og:title" content="Atlas Blog — Deep Research, Analysis & Knowledge Systems" />',
      `<meta property="og:title" content="${articleTitle}" />`
    )
    .replace(
      '<meta property="og:description" content="In-depth articles on technology, systems thinking, economics, psychology, and real-world research. Clean, readable knowledge for serious thinkers." />',
      `<meta property="og:description" content="${articleDescription}" />`
    )
    .replace(
      '<meta name="twitter:title" content="Atlas Blog — Deep Research, Analysis & Knowledge Systems" />',
      `<meta name="twitter:title" content="${articleTitle}" />`
    )
    .replace(
      '<meta name="twitter:description" content="In-depth articles on technology, systems thinking, economics, psychology, and real-world research. Clean, readable knowledge for serious thinkers." />',
      `<meta name="twitter:description" content="${articleDescription}" />`
    )
    .replace(
      '</head>',
      `  <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>\n</head>`
    );
}

async function buildSSG() {
  console.log('🚀 Starting Atlas SSG Build...');
  
  try {
    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Generate category pages
    console.log('📄 Generating category pages...');
    for (const { path: categoryPath, category, title, subtitle } of categories) {
      const html = generateCategoryHTML(category, title, subtitle);
      const outputPath = categoryPath === '/' ? 
        path.join(DIST_DIR, 'index.html') : 
        path.join(DIST_DIR, categoryPath.slice(1), 'index.html');
      
      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, html);
      console.log(`✅ Generated: ${categoryPath}`);
    }

    // Fetch and generate article pages
    console.log('📚 Fetching articles...');
    const response = await axios.get(`${API_URL}/content`, {
      params: { status: 'published' }
    });
    
    const articles = response.data;
    console.log(`📄 Found ${articles.length} articles to generate`);

    // Generate article pages
    console.log('📝 Generating article pages...');
    for (const article of articles) {
      const html = await generateArticleHTML(article);
      const outputPath = path.join(DIST_DIR, 'read', String(article.id), 'index.html');
      
      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, html);
      console.log(`✅ Generated: /read/${article.id}`);
    }

    console.log('🎉 SSG Build Complete!');
    console.log(`📊 Generated ${categories.length} category pages + ${articles.length} article pages`);
    
  } catch (error) {
    console.error('❌ SSG Build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildSSG();