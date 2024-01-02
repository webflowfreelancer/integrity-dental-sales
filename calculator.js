// Fetch practice types from JSON file
fetch(
  "https://cdn.jsdelivr.net/gh/webflowfreelancer/integrity-dental-sales/practiceTypes.json",
)
  .then((response) => response.json())
  .then((practiceTypes) => {
    const practiceTypeSelect = document.getElementById("practiceType");
    for (const practiceType of Object.keys(practiceTypes)) {
      const optionElement = document.createElement("option");
      optionElement.innerHTML = practiceType;
      optionElement.value = practiceType;
      practiceTypeSelect.appendChild(optionElement);
    }

    // Fetch data from JSON file
    document
      .getElementById("calculator")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        var zipCode = document.getElementById("zipCode").value;
        var annualCollections =
          document.getElementById("annualCollections").value;
        var practiceType = document.getElementById("practiceType").value;
        var overheadPercentageInput =
          document.getElementById("overheadPercentageInput").value / 100; // Convert to decimal

        // Validate inputs
        if (
          !zipCode ||
          !annualCollections ||
          !practiceType ||
          !overheadPercentageInput
        ) {
          alert("All fields must be filled out.");
          return;
        }

        fetch(
          "https://cdn.jsdelivr.net/gh/webflowfreelancer/integrity-dental-sales/data.json",
        )
          .then((response) => response.json())
          .then((data) => {
            // Find the corresponding zip code data
            let zipData = data[zipCode];

            // Check if zip code exists
            if (!zipData) {
              alert("We don't currently service that area.");
              return;
            }

            // Calculate the estimated values
            let baseRateShift = practiceTypes[practiceType].shift;
            let lowBase = zipData.lowBase + baseRateShift;
            let highBase = zipData.highBase + baseRateShift;
            let profitMultipleLow = 1.5;
            let profitMultipleHigh = 2.5;

            let lowRangeStandard = annualCollections * lowBase;
            let highRangeStandard = annualCollections * highBase;
            let overheadPercentage = overheadPercentageInput;
            let overheadValue = annualCollections * overheadPercentageInput;
            let profitPercentage = 1 - overheadPercentage;
            let profitValue = annualCollections * profitPercentage;

            let lowRangeProfit = profitValue * profitMultipleLow;
            let highRangeProfit = profitValue * profitMultipleHigh;

            let lowEstimate = (lowRangeStandard + lowRangeProfit) / 2;
            let highEstimate = (highRangeStandard + highRangeProfit) / 2;

            // Display the results
            document.getElementById("estimatedValueHigh").innerText =
              highEstimate.toFixed(2);
            document.getElementById("estimatedValueLow").innerText =
              lowEstimate.toFixed(2);
            document.getElementById("lowBase").innerText = lowBase.toFixed(2);
            document.getElementById("highBase").innerText = highBase.toFixed(2);
            document.getElementById("profitMultipleLow").innerText =
              profitMultipleLow.toFixed(2);
            document.getElementById("profitMultipleHigh").innerText =
              profitMultipleHigh.toFixed(2);
            document.getElementById("overhead").innerText =
              overheadValue.toFixed(2);
            document.getElementById("profitValue").innerText =
              profitValue.toFixed(2);
            document.getElementById("profitPercentage").innerText =
              profitPercentage.toFixed(2);
            document.getElementById("highProfitRange").innerText =
              highRangeProfit.toFixed(2);
            document.getElementById("lowProfitRange").innerText =
              lowRangeProfit.toFixed(2);
            document.getElementById("lowEstimate").innerText =
              lowEstimate.toFixed(2);
            document.getElementById("highEstimate").innerText =
              highEstimate.toFixed(2);
            document.getElementById("practiceTypeShift").innerText =
              baseRateShift.toFixed(2);
            document.getElementById("overheadPercentage").innerText =
              overheadPercentage.toFixed(2);
          })
          .catch((error) => console.error("Error:", error));
      });
  })
  .catch((error) => console.error("Error-PracticeTypes:", error));
