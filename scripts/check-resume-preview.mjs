import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DEFAULT_INPUT = 'resume.html';
const DEFAULT_OUT_DIR = '/tmp/onepageresume-check';
const DEFAULT_MARGIN_MM = 6;
const PAGE_HEIGHT_MM = 297;
const OVERFLOW_TOLERANCE_PX = 2;

function printHelp() {
  console.log(`Usage:
  node scripts/check-resume-preview.mjs [--input <html-file>]
  node scripts/check-resume-preview.mjs --url <page-url>

Options:
  --input <path>      Validate a local HTML file. Default: resume.html
  --url <url>         Validate an already-served page URL
  --out-dir <path>    Directory for screenshot, PDF, and JSON outputs
  --help              Show this help message

Examples:
  node scripts/check-resume-preview.mjs --input resume.html
  node scripts/check-resume-preview.mjs --url http://127.0.0.1:4173/resume.html
  node scripts/check-resume-preview.mjs --input resume.personal.html --out-dir /tmp/opr-check
`);
}

function parseArgs(argv) {
  const options = {
    input: DEFAULT_INPUT,
    outDir: DEFAULT_OUT_DIR
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help') {
      options.help = true;
      continue;
    }

    if (arg === '--input' || arg === '--url' || arg === '--out-dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }

      if (arg === '--input') options.input = value;
      if (arg === '--url') options.url = value;
      if (arg === '--out-dir') options.outDir = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.url && options.input !== DEFAULT_INPUT) {
    throw new Error('Use either --input or --url, not both.');
  }

  return options;
}

async function ensurePlaywright() {
  try {
    return await import('playwright');
  } catch (error) {
    throw new Error(
      "Playwright is not installed. Run 'npm install' and 'npx playwright install chromium' first."
    );
  }
}

async function resolveTarget(options) {
  if (options.url) {
    return {
      label: options.url,
      slug: slugifyFromUrl(options.url),
      url: options.url
    };
  }

  const inputPath = path.resolve(options.input);
  await fs.access(inputPath);
  return {
    label: inputPath,
    slug: path.basename(inputPath, path.extname(inputPath)) || 'resume',
    url: pathToFileURL(inputPath).href
  };
}

function slugifyFromUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const base = path.basename(parsed.pathname, path.extname(parsed.pathname)) || parsed.hostname || 'resume';
    return base.replace(/[^a-zA-Z0-9-_]+/g, '-');
  } catch {
    return 'resume';
  }
}

function artifactPaths(outDir, slug) {
  return {
    screenshotPath: path.join(outDir, `${slug}-preview.png`),
    pdfPath: path.join(outDir, `${slug}-preview.pdf`),
    reportPath: path.join(outDir, `${slug}-analysis.json`)
  };
}

async function analyzePage(page) {
  return page.evaluate(
    ({ defaultMarginMm, pageHeightMm, overflowTolerancePx }) => {
      function createUnitProbe(unit) {
        const probe = document.createElement('div');
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.pointerEvents = 'none';
        probe.style.width = `100${unit}`;
        probe.style.height = '1px';
        probe.style.left = '-9999px';
        probe.style.top = '0';
        document.body.appendChild(probe);
        const pixels = probe.getBoundingClientRect().width / 100;
        probe.remove();
        return pixels;
      }

      const unitToPx = {
        mm: createUnitProbe('mm'),
        px: 1
      };

      function toPixels(value, unit) {
        return value * (unitToPx[unit] || 1);
      }

      const resume = document.querySelector('.resume');
      const content = resume?.querySelector('.content') || null;
      const marker = resume?.querySelector('.fit-end-marker') || null;
      const titles = [...document.querySelectorAll('.section > h2')].map((h2) => {
        const after = getComputedStyle(h2, '::after');
        return {
          title: h2.textContent.trim(),
          display: getComputedStyle(h2).display,
          afterDisplay: after.display,
          afterWidth: after.width,
          afterHeight: after.height,
          afterMarginTop: after.marginTop
        };
      });

      const resumeRect = resume?.getBoundingClientRect() || null;
      const pageMarginMm = Number(resume?.dataset?.pageMarginMm || defaultMarginMm);
      const printableHeightPx = toPixels(pageHeightMm - (pageMarginMm * 2), 'mm');

      let usedHeightPx = null;
      if (resume && marker && content) {
        const resumeBox = resume.getBoundingClientRect();
        const markerBox = marker.getBoundingClientRect();
        const contentStyle = getComputedStyle(content);
        const paddingBottom = parseFloat(contentStyle.paddingBottom) || 0;
        usedHeightPx = (markerBox.bottom - resumeBox.top) + paddingBottom;
      } else if (resumeRect) {
        usedHeightPx = resumeRect.height;
      }

      const overflowPx = usedHeightPx == null ? null : usedHeightPx - printableHeightPx;
      const sparePx = usedHeightPx == null ? null : printableHeightPx - usedHeightPx;
      const withinOnePage = overflowPx == null ? false : overflowPx <= overflowTolerancePx;

      const checks = {
        hasResumeRoot: Boolean(resume),
        hasFitEndMarker: Boolean(marker),
        hasSectionTitles: titles.length > 0,
        withinOnePage
      };

      return {
        title: document.title,
        targetUrl: window.location.href,
        bodyScrollHeight: document.body.scrollHeight,
        viewportHeight: window.innerHeight,
        resumeHeight: resumeRect?.height ?? null,
        resumeWidth: resumeRect?.width ?? null,
        pageMarginMm,
        printableHeightPx,
        usedHeightPx,
        overflowPx,
        sparePx,
        fitState: resume?.dataset?.fitState ?? null,
        sectionTitleCount: titles.length,
        titles,
        checks,
        pass: Object.values(checks).every(Boolean)
      };
    },
    {
      defaultMarginMm: DEFAULT_MARGIN_MM,
      pageHeightMm: PAGE_HEIGHT_MM,
      overflowTolerancePx: OVERFLOW_TOLERANCE_PX
    }
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const target = await resolveTarget(options);
  const outputDir = path.resolve(options.outDir);
  await fs.mkdir(outputDir, { recursive: true });

  const { chromium } = await ensurePlaywright();
  const artifacts = artifactPaths(outputDir, target.slug);

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1600 },
      deviceScaleFactor: 2
    });

    await page.goto(target.url, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(300);

    await page.screenshot({ path: artifacts.screenshotPath, fullPage: true });
    await page.pdf({
      path: artifacts.pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '6mm', right: '6mm', bottom: '6mm', left: '6mm' }
    });

    const analysis = await analyzePage(page);
    const report = {
      generatedAt: new Date().toISOString(),
      input: {
        label: target.label,
        url: target.url
      },
      artifacts,
      passCriteria: [
        'Page loads successfully',
        'A .resume root exists',
        'A .fit-end-marker exists',
        'At least one .section > h2 exists',
        'Used height stays within printable A4 height tolerance'
      ],
      analysis
    };

    await fs.writeFile(artifacts.reportPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));

    if (!analysis.pass) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
