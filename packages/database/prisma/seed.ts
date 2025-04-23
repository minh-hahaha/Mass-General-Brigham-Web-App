import client from '../../../apps/backend/src/bin/prisma-client.ts'
import { exportNodesAndEdges } from '../../../apps/backend/src/Algorithms/ExportNodesAndEdges.ts'
import patienttransport from "../../../apps/backend/src/routes/patienttransport.ts";


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

        ],
        skipDuplicates: true,
    });

    //NODE FIRST
    await exportNodesAndEdges();

    //Department
    const createManyDepartments = await client.department.createMany({
        data: [
            {
                deptId: 1,
                deptName: 'Allergy and Clinical Immunology',
                buildingId: 1,
                deptPhone: '617-732-9850',
                deptServices: 'Allergy (environmental, food, medication and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiencyy',
            },
            {
                deptId: 2,
                deptName: 'Backup Child Care Center (Monday-Friday, 8am-4:30pm)',
                buildingId: 1,
                deptPhone: '617-732-9543',
                deptServices: 'Backup childcare for employees',
            },
            {
                deptId: 3,
                deptName: 'Brigham Dermatology Associates (BDA)',
                buildingId: 1,
                deptPhone: '617-732-9080',
                deptServices: 'Medical and surgical dermatology',
            },
            {
                deptId: 4,
                deptName: 'Brigham Obstetrics and Gynecology Group (BPG)',
                buildingId: 1,
                deptPhone: '617-732-9100',
                deptServices: 'Gynecology, obstetrics',
            },
            {
                deptId: 5,
                deptName: 'Brigham Physicians Group',
                buildingId: 1,
                deptPhone: '617-732-9900',
                deptServices: 'Adult primary care',
            },
            {
                deptId: 6,
                deptName: 'Brigham Psychiatric Specialties',
                buildingId: 1,
                deptPhone: '617-732-9811',
                deptServices: 'Psychiatry, psychology, social work',
            },
            {
                deptId: 7,
                deptName: 'Center for Pain Medicine',
                buildingId: 1,
                deptPhone: '617-732-9060',
                deptServices: 'Multidisciplinary pain management',
            },
            {
                deptId: 8,
                deptName: 'Crohns and Colitis Center',
                buildingId: 1,
                deptPhone: '617-732-6389',
                deptServices: 'Crohns disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis',
            },
            {
                deptId: 9,
                deptName: 'Endoscopy Center',
                buildingId: 1,
                deptPhone: '617-732-7426',
                deptServices: 'Bacterial overgrowth breath test, colonoscopy, H.Pylori breath test, lactose malabsorbtion breath test, upper endoscopy',
            },
            {
                deptId: 10,
                deptName: 'Gretchen S. and Edward A.Fish Center for Womens Health',
                buildingId: 1,
                deptPhone: '617-732-9300',
                deptServices: 'Cardiology, dermatology, (cosmetic, medical, and surgical), endocrinology, gastroenterology, gynecology, hematology, infectious diseases, mental health (social work), general neurology, nutrition, primary care, pulmonary, renal, rheumatology, sleep medicine, Womens Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)',
            },
            {
                deptId: 11,
                deptName: 'Laboratory (Monday-Friday 7am-6:30pm, Saturday 9am-1pm, excluding holidays)',
                buildingId: 1,
                deptPhone: '617-732-9841',
                deptServices: 'Blood work, lab services',
            },
            {
                deptId: 12,
                deptName: 'Multi-Specialty Clinic',
                buildingId: 1,
                deptPhone: '617-732-9500',
                deptServices: 'Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine',
            },
            {
                deptId: 13,
                deptName: 'Osher Clinical Center for Integrative Health',
                buildingId: 1,
                deptPhone: '617-732-9700',
                deptServices: 'Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage and movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.',
            },
            {
                deptId: 14,
                deptName: 'Patient Financial Services',
                buildingId: 1,
                deptPhone: '617-732-9677',
                deptServices: 'Patient financial counseling',
            },
            {
                deptId: 15,
                deptName: 'Pharmacy (Monday-Friday 9am-4pm, excluding holidays)',
                buildingId: 1,
                deptPhone: '617-732-9040',
                deptServices: 'Outpatient pharmacy services',
            },
            {
                deptId: 16,
                deptName: 'Radiology',
                buildingId: 1,
                deptPhone: '617-732-9801',
                deptServices: 'Bone density, Breast imaging/Mammography, ultrasound, X-Ray',

            },
            {
                deptId: 17,
                deptName: 'Radiology, MRI/CT scan',
                buildingId: 1,
                deptPhone: '617-732-9821',
                deptServices: 'CT scan, MRI, X-Ray',
            },
            {
                deptId: 18,
                deptName: 'Rehabilitation Services',
                buildingId: 1,
                deptPhone: '617-732-9525',
                deptServices: 'Orthopedic, sports, neurologic and vestibular Physical Therapy, Mens and Womens pelvic floor Physical Therapy. Hand/Occupational Therapy Speech Language Pathology',
            },
            {
                deptId: 19,
                deptName: 'Blood Draw / Phlebotomy',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Blood Draw / Phlebotomy',
            },
            {
                deptId: 20,
                deptName: 'Pharmacy',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Pharmacy',
            },
            {
                deptId: 21,
                deptName: 'Radiology',
                buildingId: 2,
                deptPhone: 'Via Fax: 508-718-4026',
                deptServices: 'magnetic resonance imaging (MRI), computed tomography (CT), single photon emission computed tomography (SPECT) imaging, ultrasound, digital mammography, x-ray, bone densitometry. Available twice a week: arthrograms, magnetic resonance (MR) arthrograms, computed tomography (CT) arthrograms, diagnostic and therapeutic joint injections',
            },
            {
                deptId: 22,
                deptName: 'Cardiovascular Services',
                buildingId: 2,
                deptPhone: '1-866-378-9164',
                deptServices: 'Transthoracic echocardiography, Holter monitoring, Electrocardiogram (ECG), Exercise tolerance testing, Exercise stress echocardiography, Vascular and arterial studies',
            },
            {
                deptId: 23,
                deptName: 'Urology',
                buildingId: 2,
                deptPhone: '1-866-378-9164',
                deptServices: 'diagnostic cystoscopy (cysto), retrograde pyelogram, transurethral resection of bladder tumor, cold knife urethrotomy, bladder stone removal, fulguration, bladder biopsy, ureteroscopy, chemotherapy and formalin instillation, laser lithotripsy, electrohydraulic lithotripsy (EHL), urethral or bladder neck contracture dilation, circumcision, suprapubic tube (catheter) change, ureteral stent placement and removal, prostate needle biopsy, varicocelectomy, hydrocelectomy, vasectomy, testicular biopsy, orchiectomy, SPARC™ procedures',
            },
            {
                deptId: 24,
                deptName: 'Urgent Care Center',
                buildingId: 2,
                deptPhone: '508-718-4400',
                deptServices: 'Urgent Care',
            },
            {
                deptId: 25,
                deptName: 'Orthopedics',
                buildingId: 2,
                deptPhone: '1-866-378-9164',
                deptServices: 'Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry',
            },
            {
                deptId: 26,
                deptName: 'Rehabilitation Services',
                buildingId: 2,
                deptPhone: ' 1-866-378-9164',
                deptServices: 'Cardiac Rehab, Occupational Therapy(Hand Therapy, Upper Extremity), Physical Therapy, Speech - Language, Clinical Lab, Surgi-Care',
            },
            {
                deptId: 27,
                deptName: 'Surgical Specialties',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Audiology, ENT, General and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness',
            },
            {
                deptId: 28,
                deptName: 'Sports Medicine Center',
                buildingId: 2,
                deptPhone: '1-866-378-9164',
                deptServices: 'arm, elbow and hand disorders, athletic injuries, spine disorders, foot and ankle problems, hip and knee disorders, shoulder issues, joint replacement, musculoskeletal oncology',
            },
            {
                deptId: 29,
                deptName: 'X-Ray Suite',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'X-Ray',
            },
            {
                deptId: 30,
                deptName: 'Electromyography (EMG)',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Electromyography (EMG)',
            },
            {
                deptId: 31,
                deptName: 'Nutrition',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Nutrition',

            },
            {
                deptId: 32,
                deptName: 'Pain Medicine',
                buildingId: 2,
                deptPhone: '1-866-378-9164',
                deptServices: 'diagnosis and treatment of spine-related low-back and neck pain, complex regional pain syndrome, post-herpetic neuralgia (shingles), other neuropathic syndromes, chronic pelvic pain, chronic pain in young adults, comprehensive evaluation for patients with cancer-related pain, headaches, arthritis',
            },
            {
                deptId: 33,
                deptName: 'Physiatry',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'interventional spine procedures, electrodiagnostic medicine consultations and alternative therapies such as medical acupuncture',
            },
            {
                deptId: 34,
                deptName: 'Plumonary Function Testing',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Plumonary Function Testing',

            },
            {
                deptId: 35,
                deptName: 'Day Surgery Center',
                buildingId: 2,
                deptPhone: 'N/A',
                deptServices: 'Day Surgery Center',

            },
            {
                deptId: 36,
                deptName: 'Mass General Hospital for Children',
                buildingId: 3,
                deptPhone: '888-644-3248',
                deptServices: 'Mass General Hospital for Children',
            },
            {
                deptId: 37,
                deptName: 'Spaulding Outpatient Center for Children',
                buildingId: 3,
                deptPhone: '(857) 307-3202',
                deptServices: 'Spaulding Outpatient Center for Children',
            },
            {
                deptId: 38,
                deptName: 'Multi Specialty Clinic',
                buildingId: 3,
                deptPhone: '1-866-378-9164',
                deptServices: "Allergy, Cardiac Arrhythmia, Dermatology, Endocrinology, Gastroenterology, Kidney (Renal) Medicine, Neurology, Neurosurgery, Ophthalmology, Optometry, Pulmonology, Rheumatology, Vein Care Services, Women's Health",
            },
            {
                deptId: 39,
                deptName: 'Patient Financial Services',
                buildingId: 3,
                deptPhone: 'N/A',
                deptServices: 'Patient Financial Services',
            },
            {
                deptId: 40,
                deptName: 'Blood Draw / Phlebotomy',
                buildingId: 3,
                deptPhone: 'N/A',
                deptServices: 'Blood Draw / Phlebotomy',
            },
            {
                deptId: 41,
                deptName: 'Community Room',
                buildingId: 3,
                deptPhone: 'N/A',
                deptServices: 'Community Room',

            },
            {
                deptId: 42,
                deptName: 'Primary Care',
                buildingId: 3,
                deptPhone: '(508) 718-4050',
                deptServices: 'Primary Care',

            },

            //TODO: UPDATE EACH DEPARTMENT WITH THEIR OWN NODES
            // {
            //     deptId: 43,
            //     deptName: "Admitting/Registration",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room1"
            // },
            // {
            //     deptId: 44,
            //     deptName: "Atrium Cafe",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room2"
            // },
            // {
            //     deptId: 45,
            //     deptName: "Audiology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room3"
            // },
            // {
            //     deptId: 46,
            //     deptName: "Blood Drawing Lab",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room4"
            // },
            // {
            //     deptId: 47,
            //     deptName: "Cardiac Rehab",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room5"
            // },
            // {
            //     deptId: 48,
            //     deptName: "Emergency Department",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room6"
            // },
            // {
            //     deptId: 49,
            //     deptName: "Emergency Entrance",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room7"
            // },
            // {
            //     deptId: 50,
            //     deptName: "GI Endoscopy",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room8"
            // },
            // {
            //     deptId: 51,
            //     deptName: "Information",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room9"
            // },
            // {
            //     deptId: 52,
            //     deptName: "MRI/CT",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room10"
            // },
            // {
            //     deptId: 53,
            //     deptName: "Patient Finances",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room11"
            // },
            // {
            //     deptId: 54,
            //     deptName: "Pre-Admittance Screening",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room12"
            // },
            // {
            //     deptId: 55,
            //     deptName: "Pulmonary Lab",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room13"
            // },
            // {
            //     deptId: 56,
            //     deptName: "Radiology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room14"
            // },
            // {
            //     deptId: 57,
            //     deptName: "Special Testing",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room15"
            // },
            // {
            //     deptId: 58,
            //     deptName: "Starbucks",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room16"
            // },
            // {
            //     deptId: 59,
            //     deptName: "Taiclet Family Center",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room17"
            // },
            // {
            //     deptId: 60,
            //     deptName: "Valet Parking",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room18"
            // },
            // {
            //     deptId: 61,
            //     deptName: "Vascular Lab",
            //     buildingId: 4,
            //     nodeId: "22PPFloor1Room19"
            // },
            // {
            //     deptId: 62,
            //     deptName: "Biomedical Engineering",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room1"
            // },
            // {
            //     deptId: 63,
            //     deptName: "Food Services",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room2"
            // },
            // {
            //     deptId: 64,
            //     deptName: "Morgue",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room3"
            // },
            // {
            //     deptId: 65,
            //     deptName: "Occupational Therapy",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room4"
            // },
            // {
            //     deptId: 66,
            //     deptName: "Otolaryngology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room5"
            // },
            // {
            //     deptId: 67,
            //     deptName: "Pharmacy",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room6"
            // },
            // {
            //     deptId: 68,
            //     deptName: "Physical Therapy",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room7"
            // },
            // {
            //     deptId: 69,
            //     deptName: "Plastic Surgery",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room8"
            // },
            // {
            //     deptId: 70,
            //     deptName: "Psychiatric Inpatient Care",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room9"
            // },
            // {
            //     deptId: 71,
            //     deptName: "Psychiatric/Addiction Recovery",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room10"
            // },
            // {
            //     deptId: 72,
            //     deptName: "Rehabilitation Services",
            //     buildingId: 4,
            //     nodeId: "22PPFloor2Room11"
            // },
            // {
            //     deptId: 73,
            //     deptName: "Cafeteria",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room1"
            // },
            // {
            //     deptId: 74,
            //     deptName: "Chapel",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room2"
            // },
            // {
            //     deptId: 75,
            //     deptName: "Family/Patient Resources",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room3"
            // },
            // {
            //     deptId: 76,
            //     deptName: "Gift Shop",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room4"
            // },
            // {
            //     deptId: 77,
            //     deptName: "Gynocology & Oncology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room5"
            // },
            // {
            //     deptId: 78,
            //     deptName: "Huvos Auditorium",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room6"
            // },
            // {
            //     deptId: 79,
            //     deptName: "Information",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room7"
            // },
            // {
            //     deptId: 80,
            //     deptName: "Obstetrics and Gynecology Associates",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room8"
            // },
            // {
            //     deptId: 81,
            //     deptName: "Outdoor Dining Terrace",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room9"
            // },
            // {
            //     deptId: 82,
            //     deptName: "Roslindale Pediatric Associates",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room10"
            // },
            // {
            //     deptId: 83,
            //     deptName: "Shuttle Pickup",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room11"
            // },
            // {
            //     deptId: 84,
            //     deptName: "Volunteer Services",
            //     buildingId: 4,
            //     nodeId: "22PPFloor3Room12"
            // },
            // {
            //     deptId: 85,
            //     deptName: "Cardiology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room1"
            // },
            // {
            //     deptId: 86,
            //     deptName: "Foot and Ankle Center",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room2"
            // },
            // {
            //     deptId: 87,
            //     deptName: "Gastroenterology Associates",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room3"
            // },
            // {
            //     deptId: 88,
            //     deptName: "HVMA Internal Medicine",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room4"
            // },
            // {
            //     deptId: 89,
            //     deptName: "HVMA Neurology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room5"
            // },
            // {
            //     deptId: 90,
            //     deptName: "Medical Library",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room6"
            // },
            // {
            //     deptId: 91,
            //     deptName: "Medical Records",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room7"
            // },
            // {
            //     deptId: 92,
            //     deptName: "MOHS Clinic",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room8"
            // },
            // {
            //     deptId: 93,
            //     deptName: "Neurology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room9"
            // },
            // {
            //     deptId: 94,
            //     deptName: "Primary Care Physicians",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room10"
            // },
            // {
            //     deptId: 95,
            //     deptName: "Pulmonary Services",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room11"
            // },
            // {
            //     deptId: 96,
            //     deptName: "Rheumatology Center",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room12"
            // },
            // {
            //     deptId: 97,
            //     deptName: "Sadowsky Conference Room",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room13"
            // },
            // {
            //     deptId: 98,
            //     deptName: "Social Work",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room14"
            // },
            // {
            //     deptId: 99,
            //     deptName: "Tynan Conference Room",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room15"
            // },
            // {
            //     deptId: 100,
            //     deptName: "Urology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor4Room16"
            // },
            // {
            //     deptId: 101,
            //     deptName: "Boston ENT Associates",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room1"
            // },
            // {
            //     deptId: 102,
            //     deptName: "Endocrinology/Diabetes/Hemotology",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room2"
            // },
            // {
            //     deptId: 103,
            //     deptName: "Headache",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room3"
            // },
            // {
            //     deptId: 104,
            //     deptName: "ICU",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room4"
            // },
            // {
            //     deptId: 105,
            //     deptName: "Internal Medicine",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room5"
            // },
            // {
            //     deptId: 106,
            //     deptName: "Oncology Clinic",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room6"
            // },
            // {
            //     deptId: 107,
            //     deptName: "Orthopaedics Associates",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room7"
            // },
            // {
            //     deptId: 108,
            //     deptName: "Outpatient Infusion Center",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room8"
            // },
            // {
            //     deptId: 109,
            //     deptName: "Primary Care Physicians",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room9"
            // },
            // {
            //     deptId: 110,
            //     deptName: "Surgical Specialties",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room10"
            // },
            // {
            //     deptId: 111,
            //     deptName: "X-Ray",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room11"
            // },
            // {
            //     deptId: 112,
            //     deptName: "X-Ray Waiting Room",
            //     buildingId: 4,
            //     nodeId: "22PPFloor5Room12"
            // }

        ],
        skipDuplicates: true,
    });

    const createManyEmployees = await client.employee.createMany({
        data: [
            {

                firstName: 'AdMinh',
                lastName: 'Ha',
                position: 'WebAdmin',
                email: 'admin',
                password: 'admin',
                departmentId: 1,
            },
            {

                firstName: 'Test',
                middleName: 'A',
                lastName: 'Person',
                position: 'Surgeon',
                dateHired: new Date(2025, 4, 5),
                email: 'surgeon1@gmail.com',
                password: 'surgeon',
                departmentId: 1,
            },
            {

                firstName: 'Test',
                middleName: 'B',
                lastName: 'Person',
                position: 'Nurse',
                dateHired: new Date(2023, 6, 9),
                email: 'nurse1@gmail.com',
                password: 'nurse',
                departmentId: 2,
            },
            {

                firstName: 'Test',
                middleName: 'C',
                lastName: 'Person',
                position: 'Doctor',
                dateHired: new Date(2020, 10, 17),
                email: 'doctor1@gmail.com',
                password: 'doctor',
                departmentId: 3,
            },
            {

                firstName: 'Test',
                middleName: 'D',
                lastName: 'Person',
                position: 'Surgeon',
                dateHired: new Date(2022, 2, 6),
                email: 'surgeon2@gmail.com',
                password: 'surgeon2',
                departmentId: 4,
            },
            {

                firstName: 'Test',
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

    const createManyServiceReqs = await client.serviceRequest.createMany({
        data: [

        ],
        skipDuplicates: true,
    });


    console.log({ createManyDepartments, createManyBuildings , createManyEmployees , createManyServiceReqs});
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


