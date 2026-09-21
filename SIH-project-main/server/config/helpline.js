/**
 * Centralized Kisan Suraksha Helpline Configuration
 * Mirrors National Kisan Call Centre (Toll-Free, 24x7)
 * Configurable via environment variables or runtime Admin updates
 */

let helplineConfig = {
  name: "Kisan Suraksha Helpline",
  nameHi: "किसान सुरक्षा हेल्पलाइन",
  nameMr: "किसान सुरक्षा हेल्पलाइन",
  number: process.env.HELPLINE_NUMBER || "1800-180-1551",
  shortCode: "1551",
  tollFree: true,
  timings: "24x7 All Days",
  languagesSupported: ["Hindi", "Marathi", "English"],
  disclaimer: "Demo / Prototype Simulation — Toll-Free National Farmer Advisory Support",
  emergencyIVRRoute: "ivr://18001801551"
};

const getHelplineConfig = () => ({ ...helplineConfig });

const updateHelplineConfig = (newConfig) => {
  helplineConfig = {
    ...helplineConfig,
    ...newConfig
  };
  return helplineConfig;
};

module.exports = {
  getHelplineConfig,
  updateHelplineConfig
};
