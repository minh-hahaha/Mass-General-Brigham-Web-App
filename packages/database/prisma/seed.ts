import client from '../../../apps/backend/src/bin/prisma-client.ts'


// Create the prisma client, this automatically connects to the database
//const prisma = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {

    const createManyBuildings = await client.building.createMany({
        data: [
            {
                building_id: 1,
                building_name: 'Chestnut Hill',
            },
            {
                building_id: 2,
                building_name: '20 Patriot Place',
            },
            {
                building_id: 3,
                building_name: '22 Patriot Place',
            }
        ],
        skipDuplicates: true,
    });
    const createManyDepartments = await client.department.createMany({
        data: [
            {
                dep_id: 1,
                dep_name: 'Allergy and Clinical Immunology',
                building_id: 1,
                dep_phone: '617-732-9850',
                dep_services: 'Allergy (environmental, food, medication and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiencyy',
            },
            {
                dep_id: 2,
                dep_name: 'Backup Child Care Center (Monday-Friday, 8am-4:30pm)',
                building_id: 1,
                dep_phone: '617-732-9543',
                dep_services: 'Backup childcare for employees',
            },
            {
                dep_id: 3,
                dep_name: 'Brigham Dermatology Associates (BDA)',
                building_id: 1,
                dep_phone: '617-732-9080',
                dep_services: 'Medical and surgical dermatology',
            },
            {
                dep_id: 4,
                dep_name: 'Brigham Obstetrics and Gynecology Group (BPG)',
                building_id: 1,
                dep_phone: '617-732-9100',
                dep_services: 'Gynecology, obstetrics',
            },
            {
                dep_id: 5,
                dep_name: 'Brigham Physicians Group',
                building_id: 1,
                dep_phone: '617-732-9900',
                dep_services: 'Adult primary care',
            },
            {
                dep_id: 6,
                dep_name: 'Brigham Psychiatric Specialties',
                building_id: 1,
                dep_phone: '617-732-9811',
                dep_services: 'Psychiatry, psychology, social work',
            },
            {
                dep_id: 7,
                dep_name: 'Center for Pain Medicine',
                building_id: 1,
                dep_phone: '617-732-9060',
                dep_services: 'Multidisciplinary pain management',
            },
            {
                dep_id: 8,
                dep_name: 'Crohns and Colitis Center',
                building_id: 1,
                dep_phone: '617-732-6389',
                dep_services: 'Crohns disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis',
            },
            {
                dep_id: 9,
                dep_name: 'Endoscopy Center',
                building_id: 1,
                dep_phone: '617-732-7426',
                dep_services: 'Bacterial overgrowth breath test, colonoscopy, H.Pylori breath test, lactose malabsorbtion breath test, upper endoscopy',
            },
            {
                dep_id: 10,
                dep_name: 'Gretchen S. and Edward A.Fish Center for Womens Health',
                building_id: 1,
                dep_phone: '617-732-9300',
                dep_services: 'Cardiology, dermatology, (cosmetic, medical, and surgical), endocrinology, gastroenterology, gynecology, hematology, infectious diseases, mental health (social work), general neurology, nutrition, primary care, pulmonary, renal, rheumatology, sleep medicine, Womens Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)',
            },
            {
                dep_id: 11,
                dep_name: 'Laboratory (Monday-Friday 7am-6:30pm, Saturday 9am-1pm, excluding holidays)',
                building_id: 1,
                dep_phone: '617-732-9841',
                dep_services: 'Blood work, lab services',
            },
            {
                dep_id: 12,
                dep_name: 'Multi-Specialty Clinic',
                building_id: 1,
                dep_phone: '617-732-9500',
                dep_services: 'Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine',
            },
            {
                dep_id: 13,
                dep_name: 'Osher Clinical Center for Integrative Health',
                building_id: 1,
                dep_phone: '617-732-9700',
                dep_services: 'Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.',
            },
            {
                dep_id: 14,
                dep_name: 'Patient Financial Services',
                building_id: 1,
                dep_phone: '617-732-9677',
                dep_services: 'Patient financial counseling',
            },
            {
                dep_id: 15,
                dep_name: 'Pharmacy (Monday-Friday 9am-4pm, excluding holidays)',
                building_id: 1,
                dep_phone: '617-732-9040',
                dep_services: 'Outpatient pharmacy services',
            },
            {
                dep_id: 16,
                dep_name: 'Radiology',
                building_id: 1,
                dep_phone: '617-732-9801',
                dep_services: 'Bone density, Breast imaging/Mammography, ultrasound, X-Ray',

            },
            {
                dep_id: 17,
                dep_name: 'Radiology, MRI/CT scan',
                building_id: 1,
                dep_phone: '617-732-9821',
                dep_services: 'CT scan, MRI, X-Ray',
            },
            {
                dep_id: 18,
                dep_name: 'Rehabilitation Services',
                building_id: 1,
                dep_phone: '617-732-9525',
                dep_services: 'Orthopedic, sports, neurologic and vestibular Physical Therapy, Mens and Womens pelvic floor Physical Therapy. Hand/Occupational Therapy Speech Language Pathology',
            },
            {
                dep_id: 19,
                dep_name: 'Blood Draw / Phlebotomy',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Blood Draw / Phlebotomy',
            },
            {
                dep_id: 20,
                dep_name: 'Pharmacy',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Pharmacy',
            },
            {
                dep_id: 21,
                dep_name: 'Radiology',
                building_id: 2,
                dep_phone: 'Via Fax: 508-718-4026',
                dep_services: 'magnetic resonance imaging (MRI), computed tomography (CT), single photon emission computed tomography (SPECT) imaging, ultrasound, digital mammography, x-ray, bone densitometry. Available twice a week: arthrograms, magnetic resonance (MR) arthrograms, computed tomography (CT) arthrograms, diagnostic and therapeutic joint injections',
            },
            {
                dep_id: 22,
                dep_name: 'Cardiovascular Services',
                building_id: 2,
                dep_phone: '1-866-378-9164',
                dep_services: 'Transthoracic echocardiography, Holter monitoring, Electrocardiogram (ECG), Exercise tolerance testing, Exercise stress echocardiography, Vascular and arterial studies',
            },
            {
                dep_id: 23,
                dep_name: 'Urology',
                building_id: 2,
                dep_phone: '1-866-378-9164',
                dep_services: 'diagnostic cystoscopy (cysto), retrograde pyelogram, transurethral resection of bladder tumor, cold knife urethrotomy, bladder stone removal, fulguration, bladder biopsy, ureteroscopy, chemotherapy and formalin instillation, laser lithotripsy, electrohydraulic lithotripsy (EHL), urethral or bladder neck contracture dilation, circumcision, suprapubic tube (catheter) change, ureteral stent placement and removal, prostate needle biopsy, varicocelectomy, hydrocelectomy, vasectomy, testicular biopsy, orchiectomy, SPARC™ procedures',
            },
            {
                dep_id: 24,
                dep_name: 'Urgent Care Center',
                building_id: 2,
                dep_phone: '508-718-4400',
                dep_services: 'Urgent Care',
            },
            {
                dep_id: 25,
                dep_name: 'Orthopedics',
                building_id: 2,
                dep_phone: '1-866-378-9164',
                dep_services: 'Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry',
            },
            {
                dep_id: 26,
                dep_name: 'Rehabilitation Services',
                building_id: 2,
                dep_phone: ' 1-866-378-9164',
                dep_services: 'Cardiac Rehab, Occupational Therapy(Hand Therapy, Upper Extremity), Physical Therapy, Speech - Language, Clinical Lab, Surgi-Care',
            },
            {
                dep_id: 27,
                dep_name: 'Surgical Specialties',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Audiology, ENT, General and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness',
            },
            {
                dep_id: 28,
                dep_name: 'Sports Medicine Center',
                building_id: 2,
                dep_phone: '1-866-378-9164',
                dep_services: 'arm, elbow and hand disorders, athletic injuries, spine disorders, foot and ankle problems, hip and knee disorders, shoulder issues, joint replacement, musculoskeletal oncology',
            },
            {
                dep_id: 29,
                dep_name: 'X-Ray Suite',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'X-Ray',
            },
            {
                dep_id: 30,
                dep_name: 'Electromyography (EMG)',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Electromyography (EMG)',
            },
            {
                dep_id: 31,
                dep_name: 'Nutrition',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Nutrition',
            },
            {
                dep_id: 32,
                dep_name: 'Pain Medicine',
                building_id: 2,
                dep_phone: '1-866-378-9164',
                dep_services: 'diagnosis and treatment of spine-related low-back and neck pain, complex regional pain syndrome, post-herpetic neuralgia (shingles), other neuropathic syndromes, chronic pelvic pain, chronic pain in young adults, comprehensive evaluation for patients with cancer-related pain, headaches, arthritis',
            },
            {
                dep_id: 33,
                dep_name: 'Physiatry',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'interventional spine procedures, electrodiagnostic medicine consultations and alternative therapies such as medical acupuncture',
            },
            {
                dep_id: 34,
                dep_name: 'Plumonary Function Testing',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Plumonary Function Testing',
            },
            {
                dep_id: 35,
                dep_name: 'Day Surgery Center',
                building_id: 2,
                dep_phone: 'N/A',
                dep_services: 'Day Surgery Center',
            },
            {
                dep_id: 36,
                dep_name: 'Mass General Hospital for Children',
                building_id: 3,
                dep_phone: '888-644-3248',
                dep_services: 'Mass General Hospital for Children',
            },
            {
                dep_id: 37,
                dep_name: 'Spaulding Outpatient Center for Children',
                building_id: 3,
                dep_phone: '(857) 307-3202',
                dep_services: 'Spaulding Outpatient Center for Children',
            },
            {
                dep_id: 38,
                dep_name: 'Allergy',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Allergic Rhinoconjunctivitis, Adverse Drug Reactions, Anaphylaxis, Asthma, Contact Dermatitis, Food Allergies, Immunodeficiency, Mastocytosis, Sinusitis, Stinging Insect, Urticaria',
            },
            {
                dep_id: 39,
                dep_name: 'Cardiology',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Evaluation, Diagnosis, Treatment Services, Arrhythmias, Irregular Heart Rhythms, Heart Palpitations, Rapid Heartbeats',
            },
            {
                dep_id: 40,
                dep_name: 'Dermatology',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Evaluation, Diagnosis, and Medical and Surgical treatment for Skin Cancers, Immune Processes, Allergic Processes, Psoriasis, Atopic Dermatitis, Skin Conditions Indicating Diseases of Other Organ Systems',
            },
            {
                dep_id: 41,
                dep_name: 'Endocrinology',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Care for Patients with: Hormonal Disorders, Diabetes, Hypertension, Thyroid Disease, Osteoporosis, Pituitary Dysfunction, Adrenal Disorders, Sexual Dysfunction, Infertility, Hirsutism, Polycystic Ovarian Syndrome, Hypoglycemia, Calcium Disorders',
            },
            {
                dep_id: 42,
                dep_name: 'Gastroenterology',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Gastroenterology',
            },
            {
                dep_id: 43,
                dep_name: 'Kidney Medicine',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Comprehensive evaluation and Management Services for kidney afflictions such as: Hypertension, Diabetic Kidney Disease, Glomerulonephritis, Vasculitis, Chronic Kidney Disease, Kidney Stones, Polycystic Kidney Disease, Inherited Kidney Diseases',
            },
            {
                dep_id: 44,
                dep_name: 'Neurology',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Consultation, Evaluation and Management services for neurologic complications including: General Neurology Complications, Epilepsy, Seizure-Related Disorders, Headache. Additionally offers Electromyography (EMG) testing',
            },
            {
                dep_id: 45,
                dep_name: 'Neurosurgery',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Complete management of pre and post surgical care for neurological conditions including: Benign Brain Tumors, Malignant Brain Tumors, Cerebrovascular Diseases, Movement Disorders, Epilepsy, Vascular Abnormalities, Degenerative Spine Disease, Brain and Spinal Disorders',
            },
            {
                dep_id: 46,
                dep_name: "Women's Health (Obstetrics and Gynecology)",
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Normal Pregnancy, High-Risk Pregnancy, General Gynecology, Infertility, Abnormal Pap Smear Evaluation, Minimally-Invasive Gynecologic Surgery, Menopause, Pap Smears, Colposcopy, Cervical LEEP, Fiberoptic Hysteroscopy, Electronic Fetal Monitoring, Ultrasound',
            },
            {
                dep_id: 47,
                dep_name: 'Ophthalmology',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Comprehensive Ophthalmology, Cataract Care, Routine Eye Care, Screenings for Systemic Diseases, Diabetes, Ophthalmic Diseases, Glaucoma, Corneal Disorders, Eye Surface Disorders, Refractive Disorders, Diagnostic Testing, Corneal Conditions, Cataract Treatment, Dry Eye, Corneal Scarring, Corneal Degenerations',
            },
            {
                dep_id: 48,
                dep_name: 'Optometry',
                building_id: 3,
                dep_phone: '617-573-3202',
                dep_services: 'Comprehensive Eye Examinations, Screening, Diagnosis, Management of Eye Conditions, Diabetic Eye Exams, Urgent Care, Eyeglass Prescriptions',
            },
            {
                dep_id: 49,
                dep_name: 'Pathology',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Testing including: Complete Blood Cell Count (CBC), Red Blood Cells, White Blood Cells, Hemoglobin, CBC and Automated Differential Count (Auto Diff), Manual Differential (Blood Smear), Urinalysis, Prothrombin Time/International Normalized Ratio (PT/INR), Partial Thromboplastin Time (PTT), Erythrocyte Sedimentation Rate (ESR), Comprehensive Metabolic Panel (CMP), Basic Metabolic Panel (BMP), Electrolyte Panel, Hepatic Function Panel, Renal Function Panel, Lipid Panel, Parathyroid Hormone (PTH), hCG, Rapid Strep Test, Fingerstick Glucose, Thyroid-Stimulating Hormone (TSH), High-Sensitivity C-Reactive Protein (hsCRP), Brain Natriuretic Peptide (proBNP), Cardiac-Specific Troponin T (cTnT), Creatine Kinase, Creatine Kinase-MB, D-Dimer, Lipase, Infectious Mono Heterophile Screen, Rapid Influenza A/B',
            },
            {
                dep_id: 50,
                dep_name: 'Pulmonology',
                building_id: 3,
                dep_phone: '1-866-378-9164',
                dep_services: 'Consultation, Diagnosis and Treatment for the entire spectrum of respiratory diseases including: Asthma, Chronic Obstructive Pulmonary Disease (COPD), Lung Nodules, Interstitial Lung Diseases, Sarcoidosis',
            },
            {
                dep_id: 51,
                dep_name: 'Rheumatology',
                building_id: 3,
                dep_phone: '(866) 378-9164',
                dep_services: "Services for Treating: Bursitis, Tendonitis, Gout, Pseudogout, Juvenile Arthritis (JA), Lupus, Neck Pain, Low Back Pain, Osteoarthritis, Osteoporosis, Polymyalgia Rheumatica, Giant Cell Arteritis, Polymyositis, Dermatomyositis, Psoriatic Arthritis, Raynaud's Disease, Rheumatoid Arthritis, Rheumatic Diseases of Pregnancy, Scleroderma, Sjogren's Syndrome, Spondyloarthropathy, Unexplained Connective Tissue Diseases, Vasculitis, Women's Health"
            },
            {
                dep_id: 52,
                dep_name: 'Patient Financial Services',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Patient Financial Services',
            },
            {
                dep_id: 53,
                dep_name: 'Blood Draw / Phlebotomy',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Blood Draw / Phlebotomy',
            },
            {
                dep_id: 54,
                dep_name: 'Community Room',
                building_id: 3,
                dep_phone: 'N/A',
                dep_services: 'Community Room',
            },
            {
                dep_id: 55,
                dep_name: 'Primary Care',
                building_id: 3,
                dep_phone: '(508) 718-4050',
                dep_services: 'Primary Care',
            },
        ],
        skipDuplicates: true,
    });
    const createManyLocations = await client.location.createMany({
        data: [
            {
                loc_type: 'hallway',
                floor: 0,
            },
            {
                loc_type: 'suite',
                room_num: 301,
                floor: 3,
                department_id: 1,
            },
            {
                loc_type: 'suite',
                room_num: 540,
                floor: 5,
                department_id: 1,
            },
            {
                loc_type: 'suite',
                room_num: 210,
                floor: 2,
                department_id: 2,
            },
            {
                loc_type: 'suite',
                room_num: 317,
                floor: 3,
                department_id: 3,
            },
            {
                loc_type: 'suite',
                room_num: 575,
                floor: 5,
                department_id: 4,
            },
            {
                loc_type: 'suite',
                room_num: 428,
                floor: 4,
                department_id: 5,
            },
            {
                loc_type: 'suite',
                room_num: 530,
                floor: 5,
                department_id: 5,
            },
            {
                loc_type: 'suite',
                room_num: 303,
                floor: 3,
                department_id: 6,
            },
            {
                loc_type: 'suite',
                room_num: 320,
                floor: 3,
                department_id: 7,
            },
            {
                loc_type: 'suite',
                room_num: 201,
                floor: 2,
                department_id: 8,
            },
            {
                loc_type: 'suite',
                room_num: 202,
                floor: 2,
                department_id: 9,
            },
            {
                loc_type: 'suite',
                room_num: 402,
                floor: 4,
                department_id: 10,
            },
            {
                loc_type: 'suite',
                room_num: 100,
                floor: 1,
                department_id: 11,
            },
            {
                loc_type: 'suite',
                room_num: 130,
                floor: 1,
                department_id: 12,
            },
            {
                loc_type: 'suite',
                room_num: 422,
                floor: 4,
                department_id: 13,
            },
            {
                loc_type: 'suite',
                room_num: 204,//204B
                floor: 2,
                department_id: 14,
            },
            {
                loc_type: 'suite',
                room_num: 317,
                floor: 3,
                department_id: 15,
            },
            {
                loc_type: 'suite',
                room_num: 560,
                floor: 5,
                department_id: 16,
            },
            {
                loc_type: 'suite',
                room_num: 102,//102B
                floor: 1,
                department_id: 17,
            },
            {
                loc_type: 'suite',
                room_num: 200,
                floor: 2,
                department_id: 18,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 19,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 20,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 21,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 22,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 23,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 24,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 2,
                department_id: 25,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 2,
                department_id: 26,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 27,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 28,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 29,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 30,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 31,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 32,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 33,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 34,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 35,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 36,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 1,
                department_id: 37,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 38,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 39,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 40,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 41,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 42,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 43,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 44,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 45,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 46,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 47,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 48,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 49,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 50,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 51,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 3,
                department_id: 52,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 53,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 54,
            },
            {
                loc_type: 'department',
                room_num: null,
                floor: 4,
                department_id: 55,
            },
        ],
        skipDuplicates: true,
    });

    const createManyEmployees = await client.employee.createMany({
        data: [
            {

                first_name: 'AdMinh',
                last_name: 'Ha',
                position: 'WebAdmin',
                email: 'admin',
                password: 'admin',
                department_id: 1,
            },
            {

                first_name: 'Test',
                middle_name: 'A',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2025, 4, 5),
                email: 'surgeon1@gmail.com',
                password: 'surgeon',
                department_id: 1,
            },
            {

                first_name: 'Test',
                middle_name: 'B',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2023, 6, 9),
                email: 'nurse1@gmail.com',
                password: 'nurse',
                department_id: 2,
            },
            {

                first_name: 'Test',
                middle_name: 'C',
                last_name: 'Person',
                position: 'Doctor',
                date_hired: new Date(2020, 10, 17),
                email: 'doctor1@gmail.com',
                password: 'doctor',
                department_id: 3,
            },
            {

                first_name: 'Test',
                middle_name: 'D',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2022, 2, 6),
                email: 'surgeon2@gmail.com',
                password: 'surgeon2',
                department_id: 4,
            },
            {

                first_name: 'Test',
                middle_name: 'E',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2024, 1, 14),
                email: 'nurse2@gmail.com',
                password: 'nurse2',
                department_id: 5,
            },
        ],
        skipDuplicates: true,
    });

    const createManyServiceReqs = await client.serviceRequest.createMany({
        data: [
            /* 
                                                 yyyy:mm:dd  hh:mm:ss */

            {
                status: 'Completed',
                priority: 'urgent',
                service_type: 'Patient Transportation',
                transport_type: 'Gurney',
            },

            {
                status: 'In Progress',
                priority: 'urgent',
                service_type: 'Equipment Request',
                transport_type: 'Cart',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'X-Ray',
                transport_type: 'None',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'equipment request',
                transport_type: 'cart',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'Blood Work',
                transport_type: 'None',
            },
        ],
        skipDuplicates: true,
    });



    console.log({ createManyDepartments, createManyBuildings , createManyLocations, createManyEmployees , createManyServiceReqs});
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


