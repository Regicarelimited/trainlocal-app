import { GeneratedPostData, LayoutMode, ContentBlock } from './types';

// Title Case Formatter
export const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    function(txt) {
      if (['ai', 'seo', 'roi', 'uk', 'usa', 'api', 'crm', 'llm', 'cqc', 'nhs'].includes(txt.toLowerCase())) {
        return txt.toUpperCase();
      }
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};

// UK Spelling & Grammar Fixer
export const ukEnforce = (text: string) => {
  if (!text) return '';
  return text
    .replace(/optimize/gi, 'optimise')
    .replace(/optimization/gi, 'optimisation')
    .replace(/color/gi, 'colour')
    .replace(/center/gi, 'centre')
    .replace(/program/gi, 'programme')
    .replace(/behavior/gi, 'behaviour')
    .replace(/analyze/gi, 'analyse')
    .replace(/modeling/gi, 'modelling');
};

// Helper to generate placeholder images
export const getPlaceholderImage = (text: string, width = 1200, height = 600) => 
  `https://placehold.co/${width}x${height}/f8fafc/334155.png?text=${encodeURIComponent(text.substring(0, 50))}`;

// Content Formatter (Applies RegiCare styles)
const formatContent = (html: string) => {
  let formatted = ukEnforce(html);
  // Ensure <p> has margin-bottom: 50px
  formatted = formatted.replace(/<p>/g, '<p style="margin-bottom: 50px;">');
  // Ensure pink links if AI missed them (fallback)
  formatted = formatted.replace(/<a href/g, '<a style="color:#E6399B; font-weight:bold;" href');
  // Ensure pink bold if AI missed them (fallback for standard b tags)
  formatted = formatted.replace(/<b>/g, '<strong style="color:#E6399B;">').replace(/<\/b>/g, '</strong>');
  return formatted;
};

// CTA HTML Generators
const CTAS = {
  services: `<div id="explore-services-cta" style="margin: 50px 0; padding: 20px; background: #f9fafb; text-align: center; border: 1px solid #e5e7eb;"><a href="https://regicare.uk/services" style="color:#E6399B; font-weight:bold; text-decoration:none;">Take a look at all the services we offer →</a></div>`,
  copilot: `<div class="co-pilot-cta" style="margin: 50px 0; padding: 20px; background: #fdf2f8; text-align: center; border: 2px solid #fce7f3;"><a href="https://regicare.uk/care-co-pilot/" style="color:#E6399B; font-weight:bold; text-decoration:none;">Feeling stuck? Try our Care Co-Pilot advisory service for free →</a></div>`,
  forecast: `<div id="forecast-cta" style="margin: 50px 0; padding: 20px; background: #eff6ff; text-align: center; border: 1px solid #dbeafe;"><a href="https://regicare.uk/forecast-builder/" style="color:#2563eb; font-weight:bold; text-decoration:none;">Plan your financial future with our Forecast Builder →</a></div>`,
  book: `<div id="book-call-cta" style="margin: 50px 0; padding: 20px; background: #f0fdf4; text-align: center; border: 1px solid #dcfce7;"><a href="https://regicare.uk/book-a-call" style="color:#E6399B; font-weight:bold; text-decoration:none;">Ready to move forward? Book a call with us today →</a></div>`
};

// Main HTML Constructor using Blocks
export const constructHtmlFromBlocks = (
  blocks: ContentBlock[], 
  mode: LayoutMode
): string => {
  
  let innerHtml = '';

  // Filter invisible blocks
  const visibleBlocks = blocks.filter(b => b.isVisible);

  visibleBlocks.forEach((block, index) => {
    switch(block.type) {
      case 'hero':
        innerHtml += `<img src="${block.meta?.src}" alt="${block.meta?.alt}" style="width:100%; height:auto; margin-bottom:40px; border-radius:8px;" />\n`;
        break;

      case 'intro':
        innerHtml += `<section>\n${formatContent(block.content || '')}\n</section>\n`;
        break;

      case 'toc':
        // Re-calculate TOC based on current visible sections
        const sections = visibleBlocks.filter(b => b.type === 'section');
        if (sections.length > 0) {
          innerHtml += `<div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
            <div style="font-weight:bold; font-size:20px; margin-bottom:15px; color:#0f172a;">Table of Contents</div>
            ${sections.map((sec, idx) => `
              <a href="#section-${idx}" style="display: block; color: #E6399B; text-decoration: none; margin-bottom: 8px; font-weight: bold;">${idx + 1}. ${sec.heading || sec.title.replace(/^H2:\s*/, '')}</a>
            `).join('')}
          </div>\n`;
        }
        break;

      case 'section':
        // Calculate dynamic index for ID
        const secIndex = visibleBlocks.filter(b => b.type === 'section').indexOf(block);
        innerHtml += `<section>\n`;
        // Standard mode: Inherit site CSS (clean h2). Modern mode: Inline styles.
        const h2Style = mode === 'modern' ? 'color: #1e293b; font-weight: 700; margin-top: 50px; margin-bottom: 30px; font-size: 28px;' : '';
        
        innerHtml += `<h2 id="section-${secIndex}" style="${h2Style}">${block.heading}</h2>\n`;
        innerHtml += formatContent(block.content || '');
        innerHtml += `\n</section>\n`;
        break;

      case 'image':
        innerHtml += `<figure style="margin: 40px 0;">
          <img src="${block.meta?.src}" alt="${block.meta?.alt}" style="width:100%; height:auto; border-radius:8px;" />
          ${block.meta?.alt ? `<figcaption style="text-align:center; color:#64748b; font-size:0.9em; margin-top:10px;">${block.meta.alt}</figcaption>` : ''}
        </figure>\n`;
        break;

      case 'cta_services':
        innerHtml += `${CTAS.services}\n`;
        break;
      case 'cta_copilot':
        innerHtml += `${CTAS.copilot}\n`;
        break;
      case 'cta_forecast':
        innerHtml += `${CTAS.forecast}\n`;
        break;
      case 'cta_book':
        innerHtml += `${CTAS.book}\n`;
        break;

      case 'conclusion':
        innerHtml += `<section>\n`;
        const h2StyleConc = mode === 'modern' ? 'color: #1e293b; font-weight: 700; margin-top: 50px; margin-bottom: 30px; font-size: 28px;' : '';
        innerHtml += `<h2 style="${h2StyleConc}">Conclusion</h2>\n`;
        innerHtml += formatContent(block.content || '');
        innerHtml += `\n</section>\n`;
        break;
    }
  });

  // Wrapper: In Standard mode, we remove the inline styles to allow Site CSS inheritance
  const wrapperStyle = mode === 'modern' 
    ? 'font-family: \'Inter\', sans-serif; line-height: 1.8; color: #334155; max-width: 800px; margin: 0 auto;' 
    : '';

  const entryContent = `<!-- RegiCare Blog Export -->
<div class="entry-content is-layout-constrained" style="${wrapperStyle}">
  ${innerHtml}
</div>`;

  if (mode === 'modern') {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 40px; background-color: #f8fafc; display: flex; justify-content: center; min-height: 100vh; }
          /* Modern Preview Overrides */
          h1, h2, h3 { color: #0f172a; }
          p { margin-bottom: 50px; }
        </style>
      </head>
      <body>
        <div style="background: white; padding: 60px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); width: 100%; max-width: 900px;">
           <h1 style="margin-bottom:30px; font-size: 2.5rem; font-weight: 800;">${visibleBlocks.find(b => b.type === 'intro')?.meta?.prompt /* Hacking title storage here or pass separate */ || 'Preview'}</h1>
          ${entryContent}
        </div>
      </body>
      </html>
    `;
  }

  return entryContent;
};

// Helper to convert API data to Blocks
export const convertDataToBlocks = (data: GeneratedPostData, keyword: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let idCounter = 0;
  const getId = () => `block-${idCounter++}`;

  // 1. Hero Image (Use Base64 if available, else placeholder)
  blocks.push({
    id: getId(),
    type: 'hero',
    title: 'Hero Image',
    isVisible: true,
    meta: {
      src: data.heroImageBase64 || getPlaceholderImage(keyword),
      alt: data.heroImageDescription || keyword,
      prompt: data.title // Storing Title in meta prompt for preview rendering convenience
    }
  });

  // 2. Intro
  blocks.push({
    id: getId(),
    type: 'intro',
    title: 'Introduction',
    content: data.intro,
    isVisible: true,
    meta: { prompt: data.title } // Store Title
  });

  // 3. TOC
  blocks.push({
    id: getId(),
    type: 'toc',
    title: 'Table of Contents',
    isVisible: true
  });

  // 4. Sections & Interspersed CTAs/Images
  data.sections.forEach((sec, idx) => {
    // Add Section
    blocks.push({
      id: getId(),
      type: 'section',
      title: `H2: ${sec.heading}`,
      heading: sec.heading,
      content: sec.content,
      isVisible: true
    });

    // Add Section Image if description exists (Use Base64 if available)
    if (sec.imageDescription) {
      blocks.push({
        id: getId(),
        type: 'image',
        title: `Image: ${sec.heading}`,
        isVisible: true,
        meta: {
          src: sec.imageBase64 || getPlaceholderImage(sec.imageDescription, 800, 400),
          alt: sec.imageDescription
        }
      });
    }

    // --- STRATEGIC INJECTIONS ---
    // CTA: Services (After Section 1)
    if (idx === 0) {
      blocks.push({ id: getId(), type: 'cta_services', title: 'CTA: See Services', isVisible: true });
    }
    // CTA: Forecast Builder (After Section 2 - NEW)
    if (idx === 1) {
      blocks.push({ id: getId(), type: 'cta_forecast', title: 'CTA: Forecast Builder', isVisible: true });
    }
    // CTA: Copilot (After Section 3)
    if (idx === 2) {
      blocks.push({ id: getId(), type: 'cta_copilot', title: 'CTA: Care Co-Pilot', isVisible: true });
    }
  });

  // 5. Book CTA (Default before conclusion)
  blocks.push({ id: getId(), type: 'cta_book', title: 'CTA: Book Call', isVisible: true });

  // 6. Conclusion
  blocks.push({
    id: getId(),
    type: 'conclusion',
    title: 'Conclusion',
    content: data.conclusion,
    isVisible: true
  });

  return blocks;
};