#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DONATION_DIR = path.join(ROOT_DIR, 'public', 'images', 'donation');
const ORGANIZER_DONATION_DIR = path.join(ROOT_DIR, 'public', 'donatesbyorgnizer');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'data', 'donations.generated.json');
const REPORT_FILE = path.join(ROOT_DIR, 'logs', 'donation-receipts-report.json');
const SUPPORTED_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp']);
const FIELD_STOP_LABELS = [
  'date',
  'payment date',
  'date of payment',
  'issue date',
  'transaction date',
  'amount',
  'amount donated',
  'gross amount',
  'donated by',
  'donor name',
  'paid by',
  'from',
  'transaction',
  'transaction id',
  'transaction reference',
  'reference',
  'receipt',
  'receipt no',
  'note',
  'purpose',
  'purpose of donation',
  'recipient details',
  'bank payment details',
];

const ORGANIZATION_HINTS = /(temple|trust|foundation|villages|society|ashram|mandir|mission|samiti|samithi|organization|committee|perumal)/i;

function normalizeWhitespace(value) {
  return value.replace(/\0/g, '').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\r/g, '').trim();
}

function normalizeLine(value) {
  return normalizeWhitespace(value).replace(/^[:\-\s]+|[:\-\s]+$/g, '').trim();
}

function normalizeMultiline(value) {
  return value
    .split(/\n+/)
    .map((line) => normalizeLine(line))
    .filter(Boolean)
    .join(', ');
}

function titleFromFilename(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function listFilesInDir(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(dirPath, entry.name))
      .filter((filePath) => SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function listDonationFiles() {
  const [donationFiles, organizerFiles] = await Promise.all([
    listFilesInDir(DONATION_DIR),
    listFilesInDir(ORGANIZER_DONATION_DIR),
  ]);

  const seenNames = new Set();
  const merged = [];

  for (const filePath of [...donationFiles, ...organizerFiles]) {
    const name = path.basename(filePath);
    if (!seenNames.has(name)) {
      seenNames.add(name);
      merged.push(filePath);
    }
  }

  return merged.sort((left, right) => left.localeCompare(right));
}

async function extractPdfText(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = await fs.readFile(filePath);
  const parsed = await pdfParse(buffer);
  return parsed.text || '';
}

async function extractImageText(filePath) {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');

  try {
    const result = await worker.recognize(filePath);
    return result?.data?.text || '';
  } finally {
    await worker.terminate();
  }
}

async function extractText(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.pdf') {
    return extractPdfText(filePath);
  }
  return extractImageText(filePath);
}

function splitLines(text) {
  return text
    .split(/\n+/)
    .map((line) => normalizeLine(line))
    .filter(Boolean);
}

function collectFollowingLines(lines, startIndex, maxLines) {
  const values = [];

  for (let index = startIndex; index < lines.length && values.length < maxLines; index += 1) {
    const line = lines[index];
    const lowerLine = line.toLowerCase().replace(/\s+/g, ' ').trim();

    if (index !== startIndex && FIELD_STOP_LABELS.some((stopLabel) => startsWithLabel(lowerLine, stopLabel))) {
      break;
    }

    values.push(line);
  }

  return normalizeMultiline(values.join('\n'));
}

function startsWithLabel(value, label) {
  const normalizedValue = value.toLowerCase().replace(/\s+/g, ' ').trim();
  return normalizedValue === label || normalizedValue.startsWith(`${label}:`) || normalizedValue.startsWith(`${label} -`);
}

function extractFieldBlock(lines, labels) {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lowerLine = line.toLowerCase().replace(/\s+/g, ' ').trim();
    const label = labels.find((item) => startsWithLabel(lowerLine, item));

    if (!label) {
      continue;
    }

    const inlineValue = normalizeLine(line.slice(label.length));
    const values = inlineValue ? [inlineValue] : [];

    for (let nextIndex = index + 1; nextIndex < lines.length && values.length < 4; nextIndex += 1) {
      const nextLine = lines[nextIndex];
      const nextLower = nextLine.toLowerCase().replace(/\s+/g, ' ').trim();

      if (FIELD_STOP_LABELS.some((stopLabel) => startsWithLabel(nextLower, stopLabel))) {
        break;
      }

      values.push(nextLine);
    }

    return normalizeMultiline(values.join('\n'));
  }

  return '';
}

function matchPattern(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return normalizeMultiline(match[1]);
    }
  }

  return '';
}

function findLineValue(lines, labels) {
  return extractFieldBlock(lines, labels);
}

function extractTopInstitution(lines) {
  for (let index = 0; index < lines.length; index += 1) {
    if (!ORGANIZATION_HINTS.test(lines[index])) {
      continue;
    }

    const block = collectFollowingLines(lines, index, 3);
    if (block) {
      return block;
    }
  }

  return '';
}

function extractApplicantName(lines) {
  const applicantIndex = lines.findIndex((line) => startsWithLabel(line.toLowerCase(), 'applicant details'));
  if (applicantIndex === -1) {
    return '';
  }

  for (let index = applicantIndex + 1; index < Math.min(lines.length, applicantIndex + 5); index += 1) {
    const line = lines[index];
    if (startsWithLabel(line.toLowerCase(), 'name')) {
      return normalizeLine(line.slice('name'.length));
    }
  }

  return '';
}

function extractAcknowledgementDonor(lines) {
  const thanksIndex = lines.findIndex((line) => line.toLowerCase().includes('received with thanks from'));
  if (thanksIndex !== -1 && lines[thanksIndex + 2]) {
    return normalizeLine(lines[thanksIndex + 2]);
  }

  const issueDateIndex = lines.findIndex((line) => startsWithLabel(line.toLowerCase(), 'issue date'));
  if (issueDateIndex !== -1 && lines[issueDateIndex + 1] && !ORGANIZATION_HINTS.test(lines[issueDateIndex + 1])) {
    return normalizeLine(lines[issueDateIndex + 1]);
  }

  return '';
}

function extractDate(text, lines) {
  const fromLines = findLineValue(lines, ['date of payment', 'payment date', 'transaction date', 'issue date', 'donation date', 'date']);
  if (fromLines) {
    return fromLines;
  }

  return matchPattern(text, [
    /(?:Issue Date|Transaction Date|Date of Payment|Payment Date|Donation Date|Date)\s*[:\-]?\s*([A-Za-z]{3,9}[\s-]+\d{1,2},?[\s-]+\d{4})/i,
    /(?:Date of Payment|Payment Date|Donation Date|Date)\s*[:\-]?\s*([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4})/i,
    /(?:Issue Date|Transaction Date|Date of Payment|Payment Date|Donation Date|Date)\s*[:\-]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i,
    /(?:Issue Date|Transaction Date|Date of Payment|Payment Date|Donation Date|Date)\s*[:\-]?\s*(\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2})/i,
  ]);
}

function extractAmount(text, lines) {
  const fromLines = findLineValue(lines, ['amount donated', 'gross amount', 'amount received', 'amount paid', 'amount paid (₹)', 'amount', 'total amount', 'paid']);
  if (fromLines) {
    const amountMatch = fromLines.match(/((?:INR|Rs\.?|USD|EUR|GBP|AUD|CAD|\$|₹|€|£)\s?[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?)/i);
    if (amountMatch && amountMatch[1]) {
      return normalizeLine(amountMatch[1]);
    }
    return fromLines;
  }

  return matchPattern(text, [
    /(?:Amount Donated|Gross Amount|Amount Received|Amount Paid(?: \(₹\))?|Amount|Total Amount|Paid)\s*[:\-]?\s*((?:INR|Rs\.?|USD|EUR|GBP|AUD|CAD|\$|₹|€|£)?\s?[\d,]+(?:\.\d{2})?)/i,
    /((?:INR|Rs\.?|USD|EUR|GBP|AUD|CAD|\$|₹|€|£)\s?[\d,]+(?:\.\d{2})?)/i,
  ]);
}

function extractRecipient(text, lines) {
  const institutionBlock = extractTopInstitution(lines);
  if (institutionBlock) {
    return institutionBlock;
  }

  const fromLines = findLineValue(lines, ['to whom', 'recipient', 'paid to', 'payee', 'merchant', 'organization', 'beneficiary', 'to']);
  if (fromLines) {
    return fromLines;
  }

  return matchPattern(text, [
    /(?:To Whom|Recipient|Paid To|Payee|Merchant|Organization|Beneficiary|To)\s*[:\-]?\s*([\s\S]{1,240}?)(?:Donated By|Donor Name|Paid By|From|Amount|Date|Transaction|Receipt|$)/i,
  ]);
}

function extractDonor(text, lines, filePath) {
  const applicantName = extractApplicantName(lines);
  if (applicantName) {
    return applicantName;
  }

  const acknowledgementDonor = extractAcknowledgementDonor(lines);
  if (acknowledgementDonor) {
    return acknowledgementDonor;
  }

  const fromLines = findLineValue(lines, ['donated by', 'donor name', 'paid by', 'from']);
  if (fromLines) {
    return fromLines;
  }

  const fromText = matchPattern(text, [
    /(?:Donated By|Donor Name|Paid By|From|Name)\s*[:\-]?\s*([^\n]{2,120})/i,
  ]);

  return fromText || titleFromFilename(filePath);
}

function buildReceiptRecord(filePath, extractedText) {
  const normalizedText = normalizeWhitespace(extractedText);
  const lines = splitLines(extractedText);

  const date = extractDate(extractedText, lines);
  const amountDonated = extractAmount(extractedText, lines);
  const toWhom = extractRecipient(extractedText, lines);
  const sponsorName = extractDonor(extractedText, lines, filePath);

  return {
    sourceFile: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
    date,
    amountDonate: amountDonated,
    toWhom,
    donatedBy: sponsorName,
    rawTextExcerpt: normalizedText.slice(0, 500),
    missingFields: ['date', 'amountDonate', 'toWhom', 'donatedBy'].filter((fieldName) => !({ date, amountDonate: amountDonated, toWhom, donatedBy: sponsorName }[fieldName])),
  };
}

function sortReceipts(receipts) {
  return receipts.sort((left, right) => left.sourceFile.localeCompare(right.sourceFile));
}

async function main() {
  const files = await listDonationFiles();
  const receipts = [];
  const errors = [];

  for (const filePath of files) {
    try {
      const extractedText = await extractText(filePath);
      const record = buildReceiptRecord(filePath, extractedText);
      receipts.push(record);
    } catch (error) {
      errors.push({
        sourceFile: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const sortedReceipts = sortReceipts(receipts);
  const generatedAt = new Date().toISOString();
  const sourceDirectories = [
    path.relative(ROOT_DIR, DONATION_DIR).replace(/\\/g, '/'),
    path.relative(ROOT_DIR, ORGANIZER_DONATION_DIR).replace(/\\/g, '/'),
  ];
  const outputRows = sortedReceipts.map((receipt) => ({
    date: receipt.date,
    amountDonate: receipt.amountDonate,
    toWhom: receipt.toWhom,
    donatedBy: receipt.donatedBy,
  }));

  const report = {
    generatedAt,
    sourceDirectories,
    filesProcessed: files.length,
    filesSucceeded: sortedReceipts.length,
    filesFailed: errors.length,
    errors,
    missingFieldRows: sortedReceipts
      .filter((receipt) => receipt.missingFields.length > 0)
      .map((receipt) => ({ sourceFile: receipt.sourceFile, missingFields: receipt.missingFields })),
  };

  await ensureDirectory(OUTPUT_FILE);
  await ensureDirectory(REPORT_FILE);
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(outputRows, null, 2)}\n`, 'utf8');
  await fs.writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Generated ${sortedReceipts.length} donation receipt rows from ${files.length} files.`);
  if (errors.length > 0) {
    console.warn(`Failed to parse ${errors.length} files. See ${path.relative(ROOT_DIR, REPORT_FILE)} for details.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});