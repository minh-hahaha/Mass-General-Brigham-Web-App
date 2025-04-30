import client from '../../../apps/backend/src/bin/prisma-client.ts'
import { exportNodesAndEdges } from '../../../apps/backend/src/Algorithms/ExportNodesAndEdges.ts'
import patienttransport from "../../../apps/backend/src/routes/forms/patienttransport.ts";


// Create the prisma client, this automatically connects to the database
//const prisma = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {

    const createManyBuildings = await client.building.createMany({
        data: [
            {
                buildingId: 1,
                buildingName: 'Chestnut Hill',
            },
            {
                buildingId: 2,
                buildingName: '20 Patriot Place',
            },
            {
                buildingId: 3,
                buildingName: '22 Patriot Place',
            },
            {
                buildingId: 4,
                buildingName: 'Faulkner Hospital',
            },
            {
                buildingId: 5,
                buildingName: 'Main Hospital',
            },

        ],
        skipDuplicates: true,
    });

    //NODE FIRST
    await exportNodesAndEdges();

    //Department
    const createManyDepartments = await client.department.createMany({
        data: [
            {
                "deptId": 12,
                "deptServices": "Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine",
                "deptName": "Multi-Specialty Clinic",
                "buildingId": 1,
                "deptPhone": "617-732-9500",
                "nodeId": "CHFloor1Road130"
            },
            {
                "deptId": 11,
                "deptServices": "Blood work, lab services",
                "deptName": "Laboratory (Monday-Friday 7am-6:30pm, Saturday 9am-1pm, excluding holidays)",
                "buildingId": 1,
                "deptPhone": "617-732-9841",
                "nodeId": "CHFloor1Room100"
            },
            {
                "deptId": 17,
                "deptServices": "CT scan, MRI, X-Ray",
                "deptName": "Radiology, MRI/CT scan",
                "buildingId": 1,
                "deptPhone": "617-732-9821",
                "nodeId": "CHFloor1Room102"
            },
            {
                "deptId": 10,
                "deptServices": "Cardiology, dermatology, (cosmetic, medical, and surgical), endocrinology, gastroenterology, gynecology, hematology, infectious diseases, mental health (social work), general neurology, nutrition, primary care, pulmonary, renal, rheumatology, sleep medicine, Womens Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)",
                "deptName": "Gretchen S. and Edward A.Fish Center for Womens Health",
                "buildingId": 1,
                "deptPhone": "617-732-9300",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 18,
                "deptServices": "Orthopedic, sports, neurologic and vestibular Physical Therapy, Mens and Womens pelvic floor Physical Therapy. Hand/Occupational Therapy Speech Language Pathology",
                "deptName": "Rehabilitation Services",
                "buildingId": 1,
                "deptPhone": "617-732-9525",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 15,
                "deptServices": "Outpatient pharmacy services",
                "deptName": "Pharmacy (Monday-Friday 9am-4pm, excluding holidays)",
                "buildingId": 1,
                "deptPhone": "617-732-9040",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 16,
                "deptServices": "Bone density, Breast imaging/Mammography, ultrasound, X-Ray",
                "deptName": "Radiology",
                "buildingId": 1,
                "deptPhone": "617-732-9801",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 13,
                "deptServices": "Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage and movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.",
                "deptName": "Osher Clinical Center for Integrative Health",
                "buildingId": 1,
                "deptPhone": "617-732-9700",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 14,
                "deptServices": "Patient financial counseling",
                "deptName": "Patient Financial Services",
                "buildingId": 1,
                "deptPhone": "617-732-9677",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 1,
                "deptServices": "Allergy (environmental, food, medication and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiencyy",
                "deptName": "Allergy and Clinical Immunology",
                "buildingId": 1,
                "deptPhone": "617-732-9850",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 2,
                "deptServices": "Backup childcare for employees",
                "deptName": "Backup Child Care Center (Monday-Friday, 8am-4:30pm)",
                "buildingId": 1,
                "deptPhone": "617-732-9543",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 3,
                "deptServices": "Medical and surgical dermatology",
                "deptName": "Brigham Dermatology Associates (BDA)",
                "buildingId": 1,
                "deptPhone": "617-732-9080",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 4,
                "deptServices": "Gynecology, obstetrics",
                "deptName": "Brigham Obstetrics and Gynecology Group (BPG)",
                "buildingId": 1,
                "deptPhone": "617-732-9100",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 5,
                "deptServices": "Adult primary care",
                "deptName": "Brigham Physicians Group",
                "buildingId": 1,
                "deptPhone": "617-732-9900",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 6,
                "deptServices": "Psychiatry, psychology, social work",
                "deptName": "Brigham Psychiatric Specialties",
                "buildingId": 1,
                "deptPhone": "617-732-9811",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 7,
                "deptServices": "Multidisciplinary pain management",
                "deptName": "Center for Pain Medicine",
                "buildingId": 1,
                "deptPhone": "617-732-9060",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 8,
                "deptServices": "Crohns disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis",
                "deptName": "Crohns and Colitis Center",
                "buildingId": 1,
                "deptPhone": "617-732-6389",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 9,
                "deptServices": "Bacterial overgrowth breath test, colonoscopy, H.Pylori breath test, lactose malabsorbtion breath test, upper endoscopy",
                "deptName": "Endoscopy Center",
                "buildingId": 1,
                "deptPhone": "617-732-7426",
                "nodeId": "CHFloor1Hallway9"
            },
            {
                "deptId": 19,
                "deptServices": "Blood Draw / Phlebotomy",
                "deptName": "Blood Draw / Phlebotomy",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room3_1"
            },
            {
                "deptId": 33,
                "deptServices": "interventional spine procedures, electrodiagnostic medicine consultations and alternative therapies such as medical acupuncture",
                "deptName": "Physiatry",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor2Room"
            },
            {
                "deptId": 25,
                "deptServices": "Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry",
                "deptName": "Orthopedics",
                "buildingId": 2,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor2Room"
            },
            {
                "deptId": 28,
                "deptServices": "arm, elbow and hand disorders, athletic injuries, spine disorders, foot and ankle problems, hip and knee disorders, shoulder issues, joint replacement, musculoskeletal oncology",
                "deptName": "Sports Medicine Center",
                "buildingId": 2,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor3Room"
            },
            {
                "deptId": 29,
                "deptServices": "X-Ray",
                "deptName": "X-Ray Suite",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor3Room"
            },
            {
                "deptId": 26,
                "deptServices": "Cardiac Rehab, Occupational Therapy(Hand Therapy, Upper Extremity), Physical Therapy, Speech - Language, Clinical Lab, Surgi-Care",
                "deptName": "Rehabilitation Services",
                "buildingId": 2,
                "deptPhone": " 1-866-378-9164",
                "nodeId": "PPFloor2Room"
            },
            {
                "deptId": 27,
                "deptServices": "Audiology, ENT, General and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness",
                "deptName": "Surgical Specialties",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor3Room_1"
            },
            {
                "deptId": 21,
                "deptServices": "magnetic resonance imaging (MRI), computed tomography (CT), single photon emission computed tomography (SPECT) imaging, ultrasound, digital mammography, x-ray, bone densitometry. Available twice a week: arthrograms, magnetic resonance (MR) arthrograms, computed tomography (CT) arthrograms, diagnostic and therapeutic joint injections",
                "deptName": "Radiology",
                "buildingId": 2,
                "deptPhone": "Via Fax: 508-718-4026",
                "nodeId": "PPFloor1Room110"
            },
            {
                "deptId": 22,
                "deptServices": "Transthoracic echocardiography, Holter monitoring, Electrocardiogram (ECG), Exercise tolerance testing, Exercise stress echocardiography, Vascular and arterial studies",
                "deptName": "Cardiovascular Services",
                "buildingId": 2,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor1Room150"
            },
            {
                "deptId": 23,
                "deptServices": "diagnostic cystoscopy (cysto), retrograde pyelogram, transurethral resection of bladder tumor, cold knife urethrotomy, bladder stone removal, fulguration, bladder biopsy, ureteroscopy, chemotherapy and formalin instillation, laser lithotripsy, electrohydraulic lithotripsy (EHL), urethral or bladder neck contracture dilation, circumcision, suprapubic tube (catheter) change, ureteral stent placement and removal, prostate needle biopsy, varicocelectomy, hydrocelectomy, vasectomy, testicular biopsy, orchiectomy, SPARC™ procedures",
                "deptName": "Urology",
                "buildingId": 2,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor1Hallway Intersection1"
            },
            {
                "deptId": 24,
                "deptServices": "Urgent Care",
                "deptName": "Urgent Care Center",
                "buildingId": 2,
                "deptPhone": "508-718-4400",
                "nodeId": "PPFloor1Room120"
            },
            {
                "deptId": 20,
                "deptServices": "Pharmacy",
                "deptName": "Pharmacy",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor1Room130"
            },
            {
                "deptId": 35,
                "deptServices": "Day Surgery Center",
                "deptName": "Day Surgery Center",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room1_1"
            },
            {
                "deptId": 30,
                "deptServices": "Electromyography (EMG)",
                "deptName": "Electromyography (EMG)",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room1_1"
            },
            {
                "deptId": 31,
                "deptServices": "Nutrition",
                "deptName": "Nutrition",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room1_1"
            },
            {
                "deptId": 32,
                "deptServices": "diagnosis and treatment of spine-related low-back and neck pain, complex regional pain syndrome, post-herpetic neuralgia (shingles), other neuropathic syndromes, chronic pelvic pain, chronic pain in young adults, comprehensive evaluation for patients with cancer-related pain, headaches, arthritis",
                "deptName": "Pain Medicine",
                "buildingId": 2,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor4Room1_1"
            },
            {
                "deptId": 34,
                "deptServices": "Plumonary Function Testing",
                "deptName": "Plumonary Function Testing",
                "buildingId": 2,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room1_1"
            },
            {
                "deptId": 40,
                "deptServices": "Blood Draw / Phlebotomy",
                "deptName": "Blood Draw / Phlebotomy",
                "buildingId": 3,
                "deptPhone": "N/A",
                "nodeId": "PPFloor1Room130"
            },
            {
                "deptId": 39,
                "deptServices": "Patient Financial Services",
                "deptName": "Patient Financial Services",
                "buildingId": 3,
                "deptPhone": "N/A",
                "nodeId": "PPFloor3Room_2"
            },
            {
                "deptId": 38,
                "deptServices": "Allergy, Cardiac Arrhythmia, Dermatology, Endocrinology, Gastroenterology, Kidney (Renal) Medicine, Neurology, Neurosurgery, Ophthalmology, Optometry, Pulmonology, Rheumatology, Vein Care Services, Women's Health",
                "deptName": "Multi Specialty Clinic",
                "buildingId": 3,
                "deptPhone": "1-866-378-9164",
                "nodeId": "PPFloor3Room_2"
            },
            {
                "deptId": 37,
                "deptServices": "Spaulding Outpatient Center for Children",
                "deptName": "Spaulding Outpatient Center for Children",
                "buildingId": 3,
                "deptPhone": "(857) 307-3202",
                "nodeId": "PPFloor11"
            },
            {
                "deptId": 36,
                "deptServices": "Mass General Hospital for Children",
                "deptName": "Mass General Hospital for Children",
                "buildingId": 3,
                "deptPhone": "888-644-3248",
                "nodeId": "PPFloor11"
            },
            {
                "deptId": 41,
                "deptServices": "Community Room",
                "deptName": "Community Room",
                "buildingId": 3,
                "deptPhone": "N/A",
                "nodeId": "PPFloor4Room2"
            },
            {
                "deptId": 42,
                "deptServices": "Primary Care",
                "deptName": "Primary Care",
                "buildingId": 3,
                "deptPhone": "(508) 718-4050",
                "nodeId": "PPFloor4Room2"
            },
            {
                "deptId": 103,
                "deptServices": null,
                "deptName": "Headache",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 50,
                "deptServices": null,
                "deptName": "GI Endoscopy",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 94,
                "deptServices": null,
                "deptName": "Primary Care Physicians",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 48,
                "deptServices": null,
                "deptName": "Emergency Department",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 98,
                "deptServices": null,
                "deptName": "Social Work",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 93,
                "deptServices": null,
                "deptName": "Neurology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 60,
                "deptServices": null,
                "deptName": "Valet Parking",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 81,
                "deptServices": null,
                "deptName": "Outdoor Dining Terrace",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 82,
                "deptServices": null,
                "deptName": "Roslindale Pediatric Associates",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 53,
                "deptServices": null,
                "deptName": "Patient Finances",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 66,
                "deptServices": null,
                "deptName": "Otolaryngology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 107,
                "deptServices": null,
                "deptName": "Orthopaedics Associates",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 70,
                "deptServices": null,
                "deptName": "Psychiatric Inpatient Care",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 69,
                "deptServices": null,
                "deptName": "Plastic Surgery",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 86,
                "deptServices": null,
                "deptName": "Foot and Ankle Center",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 106,
                "deptServices": null,
                "deptName": "Oncology Clinic",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 105,
                "deptServices": null,
                "deptName": "Internal Medicine",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 63,
                "deptServices": null,
                "deptName": "Food Services",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 49,
                "deptServices": null,
                "deptName": "Emergency Entrance",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 57,
                "deptServices": null,
                "deptName": "Special Testing",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 61,
                "deptServices": null,
                "deptName": "Vascular Lab",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 83,
                "deptServices": null,
                "deptName": "Shuttle Pickup",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 85,
                "deptServices": null,
                "deptName": "Cardiology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 59,
                "deptServices": null,
                "deptName": "Taiclet Family Center",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 109,
                "deptServices": null,
                "deptName": "Primary Care Physicians",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 111,
                "deptServices": null,
                "deptName": "X-Ray",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 108,
                "deptServices": null,
                "deptName": "Outpatient Infusion Center",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 110,
                "deptServices": null,
                "deptName": "Surgical Specialties",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 97,
                "deptServices": null,
                "deptName": "Sadowsky Conference Room",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 43,
                "deptServices": null,
                "deptName": "Admitting/Registration",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 44,
                "deptServices": null,
                "deptName": "Atrium Cafe",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 62,
                "deptServices": null,
                "deptName": "Biomedical Engineering",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 46,
                "deptServices": null,
                "deptName": "Blood Drawing Lab",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 47,
                "deptServices": null,
                "deptName": "Cardiac Rehab",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 73,
                "deptServices": null,
                "deptName": "Cafeteria",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 45,
                "deptServices": null,
                "deptName": "Audiology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 51,
                "deptServices": null,
                "deptName": "Information",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 101,
                "deptServices": null,
                "deptName": "Boston ENT Associates",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 89,
                "deptServices": null,
                "deptName": "HVMA Neurology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 68,
                "deptServices": null,
                "deptName": "Physical Therapy",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 104,
                "deptServices": null,
                "deptName": "ICU",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 91,
                "deptServices": null,
                "deptName": "Medical Records",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 80,
                "deptServices": null,
                "deptName": "Obstetrics and Gynecology Associates",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 74,
                "deptServices": null,
                "deptName": "Chapel",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 75,
                "deptServices": null,
                "deptName": "Family/Patient Resources",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 67,
                "deptServices": null,
                "deptName": "Pharmacy",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 64,
                "deptServices": null,
                "deptName": "Morgue",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 90,
                "deptServices": null,
                "deptName": "Medical Library",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 88,
                "deptServices": null,
                "deptName": "HVMA Internal Medicine",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 52,
                "deptServices": null,
                "deptName": "MRI/CT",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 99,
                "deptServices": null,
                "deptName": "Tynan Conference Room",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 96,
                "deptServices": null,
                "deptName": "Rheumatology Center",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 55,
                "deptServices": null,
                "deptName": "Pulmonary Lab",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 54,
                "deptServices": null,
                "deptName": "Pre-Admittance Screening",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 102,
                "deptServices": null,
                "deptName": "Endocrinology/Diabetes/Hemotology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 77,
                "deptServices": null,
                "deptName": "Gynocology & Oncology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 72,
                "deptServices": null,
                "deptName": "Rehabilitation Services",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 76,
                "deptServices": null,
                "deptName": "Gift Shop",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 65,
                "deptServices": null,
                "deptName": "Occupational Therapy",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 112,
                "deptServices": null,
                "deptName": "X-Ray Waiting Room",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 56,
                "deptServices": null,
                "deptName": "Radiology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room_1"
            },
            {
                "deptId": 58,
                "deptServices": null,
                "deptName": "Starbucks",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 95,
                "deptServices": null,
                "deptName": "Pulmonary Services",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 71,
                "deptServices": null,
                "deptName": "Psychiatric/Addiction Recovery",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 100,
                "deptServices": null,
                "deptName": "Urology",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 78,
                "deptServices": null,
                "deptName": "Huvos Auditorium",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 87,
                "deptServices": null,
                "deptName": "Gastroenterology Associates",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 79,
                "deptServices": null,
                "deptName": "Information",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 84,
                "deptServices": null,
                "deptName": "Volunteer Services",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 92,
                "deptServices": null,
                "deptName": "MOHS Clinic",
                "buildingId": 4,
                "deptPhone": null,
                "nodeId": "FKFloor1Room"
            },
            {
                "deptId": 124,
                "deptServices": "N/A",
                "deptName": "Dental Group / Oral Medicine",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_2"
            },
            {
                "deptId": 129,
                "deptServices": "N/A",
                "deptName": "Jen Center for Primary Care",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_4"
            },
            {
                "deptId": 145,
                "deptServices": "N/A",
                "deptName": "Shapiro Family Center",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_5"
            },
            {
                "deptId": 143,
                "deptServices": "N/A",
                "deptName": "Pharmacy",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_6"
            },
            {
                "deptId": 135,
                "deptServices": "N/A",
                "deptName": "Thoracic Surgery Clinic",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_8"
            },
            {
                "deptId": 122,
                "deptServices": "N/A",
                "deptName": "Chest Diseases, Center for",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_9"
            },
            {
                "deptId": 132,
                "deptServices": "N/A",
                "deptName": "Plastic & Reconstructive Surgery",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_10"
            },
            {
                "deptId": 137,
                "deptServices": "N/A",
                "deptName": "Weiner Center for Pre-Op Evaluation",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_13"
            },
            {
                "deptId": 136,
                "deptServices": "N/A",
                "deptName": "Watkins Cardiovascular Clinic",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_14"
            },
            {
                "deptId": 148,
                "deptServices": "N/A",
                "deptName": "Endoscopy",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_15"
            },
            {
                "deptId": 142,
                "deptServices": "N/A",
                "deptName": "Patient Financial Registration",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_19"
            },
            {
                "deptId": 125,
                "deptServices": "N/A",
                "deptName": "Ear, Nose and Throat (ENT)",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_20"
            },
            {
                "deptId": 147,
                "deptServices": "N/A",
                "deptName": "Breast Imaging, Lee Bell Center",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_21"
            },
            {
                "deptId": 123,
                "deptServices": "N/A",
                "deptName": "Comprehensive Breast Health Center",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_22"
            },
            {
                "deptId": 140,
                "deptServices": "N/A",
                "deptName": "Cafeteria",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_23"
            },
            {
                "deptId": 113,
                "deptServices": "N/A",
                "deptName": "Brigham Circle Medical Associates (BCMA)",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_25"
            },
            {
                "deptId": 141,
                "deptServices": "N/A",
                "deptName": "Carrie Hall Conference Room",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_27"
            },
            {
                "deptId": 130,
                "deptServices": "N/A",
                "deptName": "Lung Center",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 114,
                "deptServices": "N/A",
                "deptName": "Brigham Medical Specialties / Schuster Transplant",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_17"
            },
            {
                "deptId": 151,
                "deptServices": "N/A",
                "deptName": "Shapiro Procedural Check-in",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Room_24"
            },
            {
                "deptId": 128,
                "deptServices": "N/A",
                "deptName": "International Patient Center / Executive Health",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 119,
                "deptServices": "N/A",
                "deptName": "Kidney / Pancreas Transplant",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 139,
                "deptServices": "N/A",
                "deptName": "Boston Children's Hospital, Bridge to",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 134,
                "deptServices": "N/A",
                "deptName": "Rheumatology",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 121,
                "deptServices": "N/A",
                "deptName": "Nutrition",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 115,
                "deptServices": "N/A",
                "deptName": "Center for Weight Management & Metabolic Surgery",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 117,
                "deptServices": "N/A",
                "deptName": "Gastroenterology & Hepatology",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 126,
                "deptServices": "N/A",
                "deptName": "Echocardiography Lab (ECHO)",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 120,
                "deptServices": "N/A",
                "deptName": "Kidney Medicine",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 150,
                "deptServices": "N/A",
                "deptName": "Phlebotomy, Outpatient",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 133,
                "deptServices": "N/A",
                "deptName": "Podiatry",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 127,
                "deptServices": "N/A",
                "deptName": "Electrophysiology",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 118,
                "deptServices": "N/A",
                "deptName": "Genetics & Genomics Medicine",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 116,
                "deptServices": "N/A",
                "deptName": "Endocrine - Diabetes",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 131,
                "deptServices": "N/A",
                "deptName": "Orthopedics",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 138,
                "deptServices": "N/A",
                "deptName": "Bornstein Amphitheater",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 149,
                "deptServices": "N/A",
                "deptName": "Mammography",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 146,
                "deptServices": "N/A",
                "deptName": "Ambulatory Radiology (X-ray & CT scan)",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            },
            {
                "deptId": 144,
                "deptServices": "N/A",
                "deptName": "Radiation Procedural Check-in",
                "buildingId": 5,
                "deptPhone": "N/A",
                "nodeId": "BWFloor2Hallway_52"
            }
        ],
        skipDuplicates: true,
    });

    const createManyEmployees = await client.employee.createMany({
        data: [
            {
                firstName: 'Unassigned',
                lastName: '',
                position: 'Unassigned',
                email: '<EMAIL>',
                password: '<PASSWORD>',
                departmentId: 1,
                employeeId: 0
            },
            {
                firstName: 'Adminh',
                lastName: 'Ha',
                position: 'WebAdmin',
                email: 'softengD25X@gmail.com',
                password: 'cs3733D25X', //TODO: remove?
                departmentId: 1,
                admin: true,
            },
            {

                firstName: 'TestA',
                middleName: 'A',
                lastName: 'Person',
                position: 'Surgeon',
                dateHired: new Date(2025, 4, 5),
                email: 'surgeon1@gmail.com',
                password: 'surgeon',
                departmentId: 1,
            },
            {

                firstName: 'TestB',
                middleName: 'B',
                lastName: 'Person',
                position: 'Nurse',
                dateHired: new Date(2023, 6, 9),
                email: 'nurse1@gmail.com',
                password: 'nurse',
                departmentId: 2,
            },
            {

                firstName: 'TestC',
                middleName: 'C',
                lastName: 'Person',
                position: 'Doctor',
                dateHired: new Date(2020, 10, 17),
                email: 'doctor1@gmail.com',
                password: 'doctor',
                departmentId: 3,
            },
            {

                firstName: 'TestD',
                middleName: 'D',
                lastName: 'Person',
                position: 'Surgeon',
                dateHired: new Date(2022, 2, 6),
                email: 'surgeon2@gmail.com',
                password: 'surgeon2',
                departmentId: 4,
            },
            {

                firstName: 'TestE',
                middleName: 'E',
                lastName: 'Person',
                position: 'Nurse',
                dateHired: new Date(2024, 1, 14),
                email: 'nurse2@gmail.com',
                password: 'nurse2',
                departmentId: 5,
            },
        ],
        skipDuplicates: true,
    });

    // Create Service Requests (auto-incremented IDs assumed)
    const createManyServiceRequests = await client.serviceRequest.createMany({
        data: [
            {
                employeeId: 0,
                status: "Pending",
                priority: "High",
                serviceType: "Maintenance Request",
            },
            {
                employeeId: 0,
                status: "In Progress",
                priority: "Medium",
                serviceType: "Sanitation",
            },
            {
                employeeId: 0,
                status: "Completed",
                priority: "Low",
                serviceType: "Translation",
            },
            {
                employeeId: 1,
                status: "Pending",
                priority: "High",
                serviceType: "Patient Transportation",
            },
            {
                employeeId: 2,
                status: "Pending",
                priority: "Medium",
                serviceType: "Medical Device",
            },
            {
                employeeId: 3,
                status: "In Progress",
                priority: "Low",
                serviceType: "Maintenance Request",
            },
            {
                employeeId: 0,
                status: "Completed",
                priority: "High",
                serviceType: "Sanitation",
            },
        ],
        skipDuplicates: true,
    });

// Create Maintenance Requests
    const createMaintenanceRequests = await client.maintenanceRequest.createMany({
        data: [
            {
                servMaintenanceId: 1,
                maintenanceType: "Electrical",
                maintenanceHospital: "Faulkner Hospital",
                maintenanceTime: new Date("2025-01-10T10:30:00"),
            },
            {
                servMaintenanceId: 6,
                maintenanceType: "HVAC",
                maintenanceHospital: "Chestnut Hill",
                maintenanceTime: new Date("2025-03-12T15:45:00"),
            },
        ],
        skipDuplicates: true,
    });

// Create Sanitation Requests
    const createSanitationRequests = await client.sanitation.createMany({
        data: [
            {
                servReqId: 2,
                sanitationLocationId: "Faulkner Hospital",
                sanitationDepartmentId: "Headache",
                sanitationRoomNumber: 103,
                sanitationType: "Chemical Spill Cleanup",
                hazardLevel: "Moderate",
                completeBy: new Date("2025-02-15T14:00:00"),
            },
            {
                servReqId: 7,
                sanitationLocationId: "Chestnut Hill",
                sanitationDepartmentId: "Radiology, MRI/CT scan",
                sanitationRoomNumber: 17,
                sanitationType: "Biohazard Cleanup",
                hazardLevel: "High",
                completeBy: new Date("2025-01-28T13:20:00"),
            },
        ],
        skipDuplicates: true,
    });

// Create Translation Requests
    const createTranslationRequests = await client.translationRequest.createMany({
        data: [
            {
                serviceReqId: 3,
                patientId: 1234,
                language: "Spanish",
                typeMeeting: "On-site (In-Person)",
                date: new Date("2025-03-01T09:00:00"),
                location: "22 Patriot Place",
                department: "Oncology",
                duration: 30,
            },
        ],
        skipDuplicates: true,
    });

// Create Patient Transport Requests
    const createPatientTransportRequests = await client.patientTransport.createMany({
        data: [
            {
                servReqId: 4,
                patientId: 5678,
                pickupLocation: "Chestnut Hill",
                dropoffLocation: "22 Patriot Place",
                transportType: "Ambulance (ALS)",
                transportDate: new Date("2025-02-03T11:15:00"),
            },
        ],
        skipDuplicates: true,
    });

// Create Medical Device Requests
    const createMedicalDeviceRequests = await client.medicalDeviceRequest.createMany({
        data: [
            {
                servReqId: 5,
                device: "Crash Cart",
                location: "20 Patriot Place",
                deliverDate: new Date("2025-01-20T08:00:00"),
            },
        ],
        skipDuplicates: true,
    });






    console.log({ createManyDepartments, createManyBuildings , createManyEmployees , createManyServiceRequests, createMaintenanceRequests, createSanitationRequests, createTranslationRequests, createPatientTransportRequests, createMedicalDeviceRequests });
}


/*main()
    .then(async () => {
        await client.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await client.$disconnect()


    })*/
main().then(() => console.log('Temp Data Loaded')).then(async () => {await client.$disconnect()});


