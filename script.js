const form = document.getElementById('gcodeForm');
const holeCountInput = document.getElementById('holeCount');
const barLengthInput = document.getElementById('barLength');
const fileNameInput = document.getElementById('fileName');
const holeCountError = document.getElementById('holeCountError');
const fileNameError = document.getElementById('fileNameError');
const statusText = document.getElementById('statusText');
const resultSection = document.getElementById('resultSection');

const holeTitle = document.getElementById('holeTitle');
const edgeTitle = document.getElementById('edgeTitle');
const holeCode = document.getElementById('holeCode');
const edgeCode = document.getElementById('edgeCode');

const copyHoleBtn = document.getElementById('copyHoleBtn');
const copyEdgeBtn = document.getElementById('copyEdgeBtn');
const downloadHoleBtn = document.getElementById('downloadHoleBtn');
const downloadEdgeBtn = document.getElementById('downloadEdgeBtn');

const SAFE_FILE_NAME_REGEX = /^[A-Za-z0-9_-]+$/;

let currentHoleContent = '';
let currentEdgeContent = '';
let currentBaseFileName = '';

holeCountInput.addEventListener('input', () => {
  updateBarLength();
  validateHoleCount(false);
});

fileNameInput.addEventListener('input', () => {
  validateFileName(false);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const isHoleCountValid = validateHoleCount(true);
  const isFileNameValid = validateFileName(true);

  if (!isHoleCountValid || !isFileNameValid) {
    statusText.textContent = 'Please fix the input errors before generating the G-code.';
    statusText.style.color = 'var(--danger)';
    resultSection.classList.add('hidden');
    return;
  }

  const holeCount = Number.parseInt(holeCountInput.value, 10);
  const baseFileName = fileNameInput.value.trim();

  currentBaseFileName = baseFileName;
  currentHoleContent = generateHoleGCode(holeCount);
  currentEdgeContent = generateEdgeGCode(holeCount);

  holeTitle.textContent = `${baseFileName}_hole`;
  edgeTitle.textContent = `${baseFileName}_edge`;
  holeCode.textContent = currentHoleContent;
  edgeCode.textContent = currentEdgeContent;

  statusText.textContent = `Successfully generated ${baseFileName}_hole.nc and ${baseFileName}_edge.nc`;
  statusText.style.color = 'var(--success)';
  resultSection.classList.remove('hidden');
});

copyHoleBtn.addEventListener('click', async () => {
  await copyText(currentHoleContent, copyHoleBtn);
});

copyEdgeBtn.addEventListener('click', async () => {
  await copyText(currentEdgeContent, copyEdgeBtn);
});

downloadHoleBtn.addEventListener('click', () => {
  downloadFile(`${currentBaseFileName}_hole.nc`, currentHoleContent);
});

downloadEdgeBtn.addEventListener('click', () => {
  downloadFile(`${currentBaseFileName}_edge.nc`, currentEdgeContent);
});

updateBarLength();

function updateBarLength() {
  const value = holeCountInput.value.trim();
  const holeCount = Number.parseInt(value, 10);

  if (!value || Number.isNaN(holeCount) || holeCount <= 0) {
    barLengthInput.value = 'Please enter a valid hole count first';
    return;
  }

  barLengthInput.value = `${holeCount * 20} mm`;
}

function validateHoleCount(showMessage) {
  const rawValue = holeCountInput.value.trim();

  if (!rawValue) {
    setFieldState(
        holeCountInput,
        holeCountError,
        showMessage ? 'Please enter the required number of holes.' : ''
    );
    return false;
  }

  const holeCount = Number.parseInt(rawValue, 10);
  const isIntegerString = /^\d+$/.test(rawValue);

  if (!isIntegerString || Number.isNaN(holeCount) || holeCount <= 0) {
    setFieldState(
        holeCountInput,
        holeCountError,
        'The hole count must be an integer greater than 0.'
    );
    return false;
  }

  setFieldState(holeCountInput, holeCountError, '');
  return true;
}

function validateFileName(showMessage) {
  const value = fileNameInput.value.trim();

  if (!value) {
    setFieldState(
        fileNameInput,
        fileNameError,
        showMessage ? 'Please enter a file name.' : ''
    );
    return false;
  }

  if (!SAFE_FILE_NAME_REGEX.test(value)) {
    setFieldState(
        fileNameInput,
        fileNameError,
        'The file name may contain only letters, numbers, underscores (_) and hyphens (-).'
    );
    return false;
  }

  setFieldState(fileNameInput, fileNameError, '');
  return true;
}

function setFieldState(input, errorEl, errorMessage) {
  errorEl.textContent = errorMessage;
  input.classList.toggle('input-invalid', Boolean(errorMessage));
}

function formatY(value) {
  return Number(value).toFixed(3);
}

function generateHoleGCode(holeCount) {
  const header = [
    'G54',
    'S12000 M3 G4 P8',
    'G0 G90 G17',
    'T0 ([Drill]JD-4.00)',
    ''
  ];

  const blocks = [];

  for (let index = 0; index < holeCount; index += 1) {
    const y = 10 + (index * 20);
    const firstLine = index === 0
        ? `G00X10.000Y${formatY(y)}Z5.000`
        : `G00X10.000Y${formatY(y)}`;

    blocks.push([
      firstLine,
      'Z3.700',
      'G01Z-1.300F20',
      'G00Z5.000'
    ].join('\n'));
  }

  return [...header, blocks.join('\n\n')].join('\n');
}

function generateEdgeGCode(holeCount) {
  const yValue = (holeCount * 20) + 2;

  return [
    'G54',
    'S12000 M3 G4 P8',
    'G0 G90 G17',
    'T0 ([Drill]JD-4.00)',
    `G00X22.000Y${formatY(yValue)}Z5.000`,
    'Z5.020',
    'G01Z0.020F20',
    'X-2.000Z-0.635F350',
    'X22.000Z-1.291',
    'X-2.000Z-1.946',
    'X22.000Z-2.602',
    'X-2.000Z-3.257',
    'X22.000Z-3.913',
    'X-2.000Z-4.568',
    'X22.000Z-5.224',
    'X-2.000Z-5.879',
    'X22.000Z-6.535',
    'X-2.000Z-7.190',
    'X22.000Z-7.846',
    'X-2.000Z-8.501',
    'X22.000Z-9.157',
    'X-2.000Z-9.812',
    'X22.000Z-10.468',
    'X-2.000Z-11.123',
    'X22.000Z-11.779',
    'X-2.000Z-12.434',
    'X22.000Z-13.090',
    'X-2.000Z-13.745',
    'X22.000Z-14.401',
    'X-2.000Z-15.056',
    'X22.000Z-15.712',
    'X-2.000Z-16.367',
    'X22.000Z-17.023',
    'X-2.000Z-17.678',
    'X22.000Z-18.334',
    'X-2.000Z-18.989',
    'X22.000Z-19.645',
    'X-2.000Z-20.300',
    'X22.000',
    'G00Z5.000'
  ].join('\n');
}

async function copyText(text, button) {
  if (!text) {
    statusText.textContent = 'There is no G-code available to copy yet. Please generate it first.';
    statusText.style.color = 'var(--danger)';
    return;
  }

  const originalText = button.textContent;

  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
    statusText.textContent = 'The G-code has been copied to the clipboard.';
    statusText.style.color = 'var(--success)';
  } catch (error) {
    statusText.textContent = 'Copy failed. Some browsers require HTTPS or localhost to use the copy function.';
    statusText.style.color = 'var(--danger)';
  }

  window.setTimeout(() => {
    button.textContent = originalText;
  }, 1200);
}

function downloadFile(fileName, content) {
  if (!content) {
    statusText.textContent = 'There is no G-code available to download yet. Please generate it first.';
    statusText.style.color = 'var(--danger)';
    return;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  statusText.textContent = `${fileName} download started`;
  statusText.style.color = 'var(--success)';
}