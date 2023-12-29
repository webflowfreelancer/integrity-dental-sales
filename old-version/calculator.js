// Existing data structures
const zipCodeData = {
  90210: {
    highBaseModifier: 95,
    lowBaseModifier: 70,
    agentName: "Agent Beverly",
  },
  10001: {
    highBaseModifier: 85,
    lowBaseModifier: 65,
    agentName: "Agent York",
  },
  60610: {
    highBaseModifier: 100,
    lowBaseModifier: 75,
    agentName: "Agent Chicago",
  },
  77005: {
    highBaseModifier: 90,
    lowBaseModifier: 55,
    agentName: "Agent Houston",
  },
  "02108": {
    highBaseModifier: 80,
    lowBaseModifier: 60,
    agentName: "Agent Boston",
  },
  94105: {
    highBaseModifier: 95,
    lowBaseModifier: 80,
    agentName: "Agent Francisco",
  },
  30309: {
    highBaseModifier: 85,
    lowBaseModifier: 50,
    agentName: "Agent Atlanta",
  },
  98101: {
    highBaseModifier: 88,
    lowBaseModifier: 68,
    agentName: "Agent Seattle",
  },
  33131: {
    highBaseModifier: 92,
    lowBaseModifier: 72,
    agentName: "Agent Miami",
  },
  20001: {
    highBaseModifier: 100,
    lowBaseModifier: 85,
    agentName: "Agent Washington",
  },
};

/**
 * Modifier values for different types of dental practices. Each practice type
 * has a multiplier that affects the valuation calculation.
 */
const practiceTypeModifiers = {
  general: 1.0,
  orthodontics: 1.2,
  pediatric: 1.1,
  cosmetic: 1.3,
  endodontics: 1.2,
  oral_surgery: 1.4,
  // ... add more practice types and their corresponding modifiers as needed
};

document
  .getElementById("overheadPercentage")
  .addEventListener("overheadPercentage", updateValuation);

// Existing data structures and event listeners remain the same.

function calculateValuation() {
  const collections = parseFloat(document.getElementById("collections").value);
  const zipCode = document.getElementById("zipCode").value;
  const practiceType = document.getElementById("practiceType").value;
  const overheadPercentage =
    parseFloat(document.getElementById("overheadPercentage").value) / 100;

  if (isNaN(collections) || isNaN(overheadPercentage)) {
    alert("Please enter valid collections and overhead percentage.");
    return;
  }

  const valuationData = calculateValuationData(
    collections,
    zipCode,
    practiceType,
    overheadPercentage,
  );

  displayResults(...valuationData);

  // Set the URL for the agent bio, if the agent is available
  if (valuationData[4] !== "We do not currently service this area.") {
    const agentBioUrl =
      "path_to_agent_bios/" +
      valuationData[4].replace(" ", "_").toLowerCase() +
      ".html";
    document.getElementById("agentInfo").setAttribute("hx-get", agentBioUrl);
  }
}

function updateValuation() {
  const collections = parseFloat(document.getElementById("collections").value);
  const zipCode = document.getElementById("zipCode").value;
  const practiceType = document.getElementById("practiceType").value;
  const overheadPercentage =
    parseFloat(document.getElementById("overheadPercentage").value) / 100;

  const valuationData = calculateValuationData(
    collections,
    zipCode,
    practiceType,
    overheadPercentage,
  );

  displayResults(...valuationData);
}

function calculateValuationData(
  collections,
  zipCode,
  practiceType,
  overheadPercentage,
) {
  const zipCodeInfo = zipCodeData[zipCode];
  let highBaseModifier = 0,
    lowBaseModifier = 0,
    agentName = "We do not currently service this area.";

  if (zipCodeInfo) {
    highBaseModifier = zipCodeInfo.highBaseModifier / 100;
    lowBaseModifier = zipCodeInfo.lowBaseModifier / 100;
    agentName = zipCodeInfo.agentName;
  }

  const practiceTypeModifier = practiceTypeModifiers[practiceType] || 1;

  const highValuation =
    collections * highBaseModifier * overheadPercentage * practiceTypeModifier;
  const lowValuation =
    collections * lowBaseModifier * overheadPercentage * practiceTypeModifier;
  const profitHigh = highValuation * (1 - overheadPercentage);
  const profitLow = lowValuation * (1 - overheadPercentage);

  return [highValuation, lowValuation, profitHigh, profitLow, agentName];
}

function displayResults(
  highValuation,
  lowValuation,
  profitHigh,
  profitLow,
  agentName,
) {
  document.getElementById("highValuationResult").innerText =
    "High Valuation: $" + highValuation.toLocaleString();
  document.getElementById("lowValuationResult").innerText =
    "Low Valuation: $" + lowValuation.toLocaleString();
  document.getElementById("profitHighResult").innerText =
    "High Profit: $" + profitHigh.toLocaleString();
  document.getElementById("profitLowResult").innerText =
    "Low Profit: $" + profitLow.toLocaleString();
  document.getElementById("agentInfo").innerText = agentName;

  // Show results
  document.getElementById("highValuationResult").style.display = "block";
  document.getElementById("lowValuationResult").style.display = "block";
  document.getElementById("profitHighResult").style.display = "block";
  document.getElementById("profitLowResult").style.display = "block";
  document.getElementById("agentInfo").style.display = "block";
}

/**
 * Resets the form and hides the result and agent information.
 */
function resetForm() {
  document.getElementById("valuationForm").style.display = "block";
  document.getElementById("valuationResult").innerText /= "none";
  document.getElementById("valuationResult").style.display = "none";
  document.getElementById("agentInfo").innerText = "none";
  document.getElementById("agentInfo").style.display = "none";
  document.getElementById("backButton").style.display = "none";
}
