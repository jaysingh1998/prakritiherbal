/**
 * BMI Calculator for Prakriti Herbal
 * Calculates BMI, displays health status, and provides recommendations
 */

class BMICalculator {
  constructor() {
    this.BMI_CATEGORIES = {
      underweight: { min: 0, max: 18.4, label: 'कम वज़न', color: '#8b9dc3', emoji: '🔵' },
      normal: { min: 18.5, max: 24.9, label: 'स्वस्थ', color: '#d4a574', emoji: '🟢' },
      overweight: { min: 25, max: 29.9, label: 'अधिक', color: '#d97070', emoji: '🟡' },
      obese: { min: 30, max: 100, label: 'मोटापा', color: '#c85a54', emoji: '🔴' }
    };
  }

  /**
   * Calculate BMI based on height and weight
   * @param {number} height - Height in cm
   * @param {number} weight - Weight in kg
   * @returns {number} - BMI value
   */
  calculateBMI(height, weight) {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  /**
   * Get BMI category
   * @param {number} bmi - BMI value
   * @returns {object} - Category object with label, color, emoji
   */
  getCategory(bmi) {
    if (bmi === null) return null;
    for (let [key, category] of Object.entries(this.BMI_CATEGORIES)) {
      if (bmi >= category.min && bmi <= category.max) {
        return { ...category, key };
      }
    }
    return null;
  }

  /**
   * Get health recommendations based on BMI
   * @param {string} categoryKey - BMI category key
   * @returns {string} - Recommendation text in Hindi
   */
  getRecommendation(categoryKey) {
    const recommendations = {
      underweight: "आप कम वज़न हैं। स्वस्थ वज़न बढ़ाने के लिए proper nutrition लें और आयुर्वेदिक expert से सलाह लें।",
      normal: "आपका वज़न बिल्कुल सही है! इसे बनाए रखने के लिए healthy lifestyle अपनाएं।",
      overweight: "आप थोड़े अधिक वज़न वाले हैं। Slim Fit Pro आपको स्वस्थ वज़न तक पहुँचने में मदद कर सकता है।",
      obese: "आपको वज़न कम करने की ज़रूरत है। Slim Fit Pro + Green Tea Booster combination सबसे effective है। अभी ही expert से सलाह लें!"
    };
    return recommendations[categoryKey] || "";
  }

  /**
   * Get ideal weight range for given height
   * @param {number} height - Height in cm
   * @returns {object} - Min and max ideal weight
   */
  getIdealWeightRange(height) {
    const heightInMeters = height / 100;
    return {
      min: parseFloat((18.5 * heightInMeters * heightInMeters).toFixed(1)),
      max: parseFloat((24.9 * heightInMeters * heightInMeters).toFixed(1))
    };
  }

  /**
   * Calculate weight to lose for reaching ideal BMI
   * @param {number} currentWeight - Current weight in kg
   * @param {object} idealRange - Ideal weight range
   * @returns {number} - Weight to lose (negative if overweight, 0 if normal)
   */
  getWeightToLose(currentWeight, idealRange) {
    const toLose = currentWeight - idealRange.max;
    return toLose > 0 ? parseFloat(toLose.toFixed(1)) : 0;
  }
}

// Initialize and expose calculator globally
const bmiCalc = new BMICalculator();

/**
 * Main function to calculate and display BMI results
 * Called from HTML form
 */
function calculateBMI() {
  const height = parseFloat(document.getElementById('bmi-height')?.value);
  const weight = parseFloat(document.getElementById('bmi-weight')?.value);
  const resultDiv = document.getElementById('bmi-result');

  if (!resultDiv) return;

  // Validate inputs
  if (!height || !weight) {
    resultDiv.innerHTML = '<p style="color: #e74c3c; text-align: center;">कृपया लंबाई और वज़न दोनों दर्ज करें</p>';
    return;
  }

  if (height < 100 || height > 250) {
    resultDiv.innerHTML = '<p style="color: #e74c3c; text-align: center;">कृपया 100-250 cm के बीच लंबाई दर्ज करें</p>';
    return;
  }

  if (weight < 20 || weight > 300) {
    resultDiv.innerHTML = '<p style="color: #e74c3c; text-align: center;">कृपया 20-300 kg के बीच वज़न दर्ज करें</p>';
    return;
  }

  // Calculate
  const bmi = bmiCalc.calculateBMI(height, weight);
  const category = bmiCalc.getCategory(bmi);
  const recommendation = bmiCalc.getRecommendation(category.key);
  const idealRange = bmiCalc.getIdealWeightRange(height);
  const weightToLose = bmiCalc.getWeightToLose(weight, idealRange);

  // Build result HTML
  let resultHTML = `
    <div style="text-align: center; padding: 14px; background: rgba(255,255,255,0.8); border-radius: 12px; border: 1.5px solid ${category.color};">
      <div style="font-size: 2rem; margin-bottom: 4px;">${category.emoji}</div>
      <div style="font-size: 2rem; font-weight: 900; color: ${category.color}; margin-bottom: 2px;">${bmi}</div>
      <div style="font-size: 0.95rem; font-weight: 700; color: ${category.color}; margin-bottom: 8px;">${category.label}</div>
      
      <div style="background: rgba(212,165,116,0.08); padding: 8px; border-radius: 10px; margin-bottom: 8px;">
        <div style="font-size: 0.8rem; color: #333;">आदर्श वज़न: <strong>${idealRange.min} – ${idealRange.max} kg</strong></div>
      </div>
      
      <div style="font-size: 0.85rem; color: #333; line-height: 1.4; margin-bottom: 8px;">${recommendation}</div>
      
      ${weightToLose > 0 ? `
      <div style="background: rgba(200,90,84,0.1); padding: 6px; border-radius: 8px; margin-bottom: 8px;">
        <div style="font-size: 0.8rem; color: #c85a54;"><strong>${weightToLose} kg</strong> कम करें</div>
      </div>
      ` : ''}
      
      <a href="#quick-form" style="display: inline-block; margin-top: 8px; background: linear-gradient(135deg, #d4a574, #a08070); color: #fff; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">Free Consultation</a>
    </div>
  `;

  resultDiv.innerHTML = resultHTML;
}

// Reset BMI calculator
function resetBMI() {
  document.getElementById('bmi-height').value = '';
  document.getElementById('bmi-weight').value = '';
  document.getElementById('bmi-result').innerHTML = '';
}

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', function() {
  const heightInput = document.getElementById('bmi-height');
  const weightInput = document.getElementById('bmi-weight');
  
  [heightInput, weightInput].forEach(input => {
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateBMI();
      });
    }
  });
});
