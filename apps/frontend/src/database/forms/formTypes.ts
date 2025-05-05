// THIS HAS ALL THE TYPES AND ARRAYS USED BY THE FORMS

//ALL
export type mgbHospitalType = "" | 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place' | 'Faulkner Hospital';
export const mgbHospitals = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place', 'Faulkner Hospital'];
export type priorityType = "" | 'Low' | 'Medium' | 'High' | 'Emergency';
export const priorityArray = ['Low', 'Medium', 'High', 'Emergency'];
export type statusType = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';


export const splitDateTime = (dateTime: string) => {
    const [date, timeWithSeconds] = dateTime.split('T');
    const time = timeWithSeconds?.slice(0, 5) || '';  // Grab only HH:MM part (without seconds)
    return { date, time };
};


export function formatDateForEdit(dateString: string): string {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // gets YYYY-MM-DDTHH:MM
}


//Maintenance Request
export type reqMaintenanceType =
    | "Routine Facility"
    | "HVAC"
    | "Electrical"
    | "Plumbing"
    | "Elevator and Lift"
    | "Generator/Backup Power"
    | "Medical Equipment"
    | "Fire Safety Systems"
    | "Security System"
    | "Waste Management"
    | "Groundskeeping"
    | "Infection Control System"
    | "Laundry Systems"
    | "Sterile Processing Equipment"
    | "Telecommunications"
    | "Building Automation System"
    | "Roof and Structural"
    | "Patient Room Turnover Support";

export const maintenanceTypeArray = [
    "Routine Facility",
    "HVAC",
    "Electrical",
    "Plumbing",
    "Elevator and Lift",
    "Generator/Backup Power",
    "Medical Equipment",
    "Fire Safety Systems",
    "Security System",
    "Waste Management",
    "Groundskeeping",
    "Infection Control System",
    "Laundry Systems",
    "Sterile Processing Equipment",
    "Telecommunications",
    "Building Automation System",
    "Roof and Structural",
    "Patient Room Turnover Support"
];

//Medical Device Request
export type medicalDeviceType =
    | 'ECG Monitor'
    | 'Vital Signs Monitor'
    | 'Pulse Oximeter'
    | 'Infusion Pump'
    | 'Syringe Pump'
    | 'Defibrillator'
    | 'Ventilator'
    | 'Nebulizer'
    | 'Anesthesia Machine'
    | 'Wheelchair'
    | 'IV Stand'
    | 'Suction Machine'
    | 'Warming Blanket System'
    | 'Oxygen Concentrator'
    | 'Portable Suction Unit'
    | 'Crash Cart';

export const medicalDevices = ['ECG Monitor', 'Vital Signs Monitor', 'Pulse Oximeter', 'Infusion Pump', 'Syringe Pump',
    'Defibrillator', 'Ventilator', 'Nebulizer', 'Anesthesia Machine',
    'Wheelchair', 'IV Stand', 'Suction Machine', 'Warming Blanket System',
    'Oxygen Concentrator', 'Portable Suction Unit', 'Crash Cart'];

//Sanitation Request
export type reqSanitationType =
    "Routine Cleaning"
    | "Deep Cleaning"
    | "Detail Cleaning"
    | "Surface Disinfection"
    | "Fogging Disinfection"
    | "UV Sanitation"
    | "Steam Sanitation"
    | "Sterilization"
    | "Biohazard Cleanup"
    | "Chemical Spill Cleanup"
    | "Mold Remediation"
    | "Pest Sanitation"
    | "Fire/Smoke Residue Cleaning"
    | "Flood/Water Damage Cleaning"
    | "Restroom Sanitation"
    | "Kitchen/Breakroom Sanitation"
    | "Trash/Recycling Sanitation"
    | "Locker Room/Changing Area Cleaning"
    | "Isolation Room Cleaning"
    | "Operating Room Turnover"
    | "Cleanroom Sanitation";

export const reqSanitationArray = [
    "Routine Cleaning",
    "Deep Cleaning",
    "Detail Cleaning",
    "Surface Disinfection",
    "Fogging Disinfection",
    "UV Sanitation",
    "Steam Sanitation",
    "Sterilization",
    "Biohazard Cleanup",
    "Chemical Spill Cleanup",
    "Mold Remediation",
    "Pest Sanitation",
    "Fire/Smoke Residue Cleaning",
    "Flood/Water Damage Cleaning",
    "Restroom Sanitation",
    "Kitchen/Breakroom Sanitation",
    "Trash/Recycling Sanitation",
    "Locker Room/Changing Area Cleaning",
    "Isolation Room Cleaning",
    "Operating Room Turnover",
    "Cleanroom Sanitation"
];
export type hazardLevelType = "" | 'Low' | 'Moderate' | 'High' | 'Extreme';
export const hazardLevelArray = ['Low', 'Moderate', 'High', 'Extreme'];

//Translation Request

export type meetingType = 'Remote (Online)' | 'On-site (In-Person)';
export const meetingTypeArray = ['Remote (Online)', 'On-site (In-Person)'];


export type translateLangugeType =
  | "Arabic"
  | "Cantonese Chinese"
  | "French"
  | "Hindi"
  | "Japanese"
  | "Mandarin Chinese"
  | "Portuguese"
  | "Russian"
  | "Spanish"
  | "Vietnamese";
export const translateLangugeArray = [
  "Arabic",
  "Cantonese Chinese",
  "French",
  "Hindi",
  "Japanese",
  "Mandarin Chinese",
  "Portuguese",
  "Russian",
  "Spanish",
  "Vietnamese"
];

//Transport Request

export type hospitalTransportType = ""
    | "Ambulance (ALS)"
    | "Helicopter"
    | "Critical Care Transport"
    | "Neonatal Transport"
    | "Medical Van"
    | "Mobile ICU"
    | "Bariatric Transport";

export const hospitalTransportArray = [
    "Ambulance (BLS)",
    "Ambulance (ALS)",
    "Helicopter",
    "Critical Care Transport",
    "Neonatal Transport",
    "Medical Van",
    "Mobile ICU",
    "Bariatric Transport"
];

