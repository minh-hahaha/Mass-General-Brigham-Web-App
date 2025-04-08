import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createManyEmployees = await client.employee.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {
                id: 1,
                first_name: 'Test',
                middle_name: 'A',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2025, 4, 5),
                email: 'surgeon1@gmail.com',
                password: 'surgeon',
            },
            {
                id: 2,
                first_name: 'Test',
                middle_name: 'B',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2023, 6, 9),
                email: 'nurse1@gmail.com',
                password: 'nurse',
            },
            {
                id: 3,
                first_name: 'Test',
                middle_name: 'C',
                last_name: 'Person',
                position: 'Doctor',
                date_hired: new Date(2020, 10, 17),
                email: 'doctor1@gmail.com',
                password: 'doctor',
            },
            {
                id: 4,
                first_name: 'Test',
                middle_name: 'D',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2022, 2, 6),
                email: 'surgeon2@gmail.com',
                password: 'surgeon2',
            },
            {
                id: 5,
                first_name: 'Test',
                middle_name: 'E',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2024, 1, 14),
                email: 'nurse2@gmail.com',
                password: 'nurse2',
            },
        ],
        skipDuplicates: true,
    });

    const createManyServiceReqs = await client.serviceRequest.createMany({
        data: [
            /*                                      yyyy:mm:dd  hh:mm:ss */
            {
                request_id: 1,
                employee_id: 1,
                request_date: new Date(2025, 3, 15, 13, 32, 10),
                status: 'in progress',
                comments: 'comment',
                urgency: 10,
                location: 1,
                service: 'equipment',
            },
            {
                request_id: 2,
                employee_id: null,
                request_date: new Date(2025, 3, 6, 9, 15, 14),
                status: 'not started',
                comments: null,
                urgency: 5,
                location: 2,
                service: 'equipment',
            },
            {
                request_id: 3,
                employee_id: 2,
                request_date: new Date(2025, 4, 2, 10, 4, 38),
                status: 'in progress',
                comments: null,
                urgency: 2,
                location: 3,
                service: 'equipment',
            },
            {
                request_id: 4,
                employee_id: 4,
                request_date: new Date(2025, 2, 20, 7, 8, 50),
                status: 'completed',
                comments: 'comment',
                urgency: 7,
                location: 4,
                service: 'equipment',
            },
            {
                request_id: 5,
                employee_id: 2,
                request_date: new Date(2025, 1, 31, 15, 1, 42),
                status: 'in progress',
                comments: 'comment',
                urgency: 2,
                location: 5,
                service: 'equipment',
            },
            {
                request_id: 6,
                employee_id: 3,
                request_date: new Date(2025, 4, 1, 13, 23, 30),
                status: 'not started',
                comments: 'comment',
                urgency: 3,
                location: 6,
                service: 'equipment',
            },
            {
                request_id: 7,
                employee_id: 3,
                request_date: new Date(2025, 1, 16, 12, 54, 14),
                status: 'completed',
                comments: null,
                urgency: 1,
                location: 7,
                service: 'equipment',
            },
            {
                request_id: 8,
                employee_id: null,
                request_date: new Date(2025, 4, 3, 10, 33, 11),
                status: 'not started',
                comments: 'comment',
                urgency: 4,
                location: 8,
                service: 'equipment',
            },
            {
                request_id: 9,
                employee_id: null,
                request_date: new Date(2025, 3, 19, 15, 39, 20),
                status: 'not started',
                comments: null,
                urgency: 5,
                location: 9,
                service: 'equipment',
            },
            {
                request_id: 10,
                employee_id: 5,
                request_date: new Date(2025, 4, 2, 3, 42, 15),
                status: 'completed',
                comments: null,
                urgency: 6,
                location: 10,
                service: 'equipment',
            },
        ],
        skipDuplicates: true,
    });
    const createDirectory = await client.directory.createMany({
        data: [
            {
                directory_id: 0,
                service: 'Allergy and Clinical Immunology',
                specialty:
                    'Allergy, (environmental, food, medication, and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiency',
                telephone: '(617) 732-9850',
            },
            {
                directory_id: 1,
                service: 'Backup Child Care Center',
                specialty: 'Backup childcare for employees',
                telephone: '(617) 732-9543',
            },
            {
                directory_id: 2,
                service: 'Brigham Dermatology Associated (BDA)',
                specialty: 'Medical and surgical dermatology',
                telephone: '(617) 732-9080',
            },
            {
                directory_id: 3,
                service: 'Brigham Obstetrics and Gynecology Group (BOGG)',
                specialty: 'Gynecology, obsterics',
                telephone: '(617) 732-9100',
            },
            {
                directory_id: 4,
                service: 'Brigham Physicians Group (BPG)',
                specialty: 'Adult primary care',
                telephone: '(617) 732-9900',
            },
            {
                directory_id: 5,
                service: 'Brigham Psychiatric Specialties',
                specialty: 'Psychiatry psychology, social work',
                telephone: '(617) 732-9811',
            },
            {
                directory_id: 6,
                service: 'Center for Pain Medicine',
                specialty: 'Multidisciplinary pain management',
                telephone: '(617) 732-9060',
            },
            {
                directory_id: 7,
                service: "Crohn's and Colitis Center",
                specialty:
                    'Crohn’s disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis',
                telephone: '(617) 732-6389',
            },
            {
                directory_id: 8,
                service: 'Endoscopy Center',
                specialty:
                    'Bacterial overgrowth breath test, colonoscopy, H. Pylori breath test, lactose malabsorption breath test, upper endoscopy',
                telephone: '(617) 732-7426',
            },
            {
                directory_id: 9,
                service: "Gretchen S. and Edward A. Fish Center for Women's Health",
                specialty:
                    'Cardiology, dermatology (cosmetic, medical, and surgical), endocrinology, gastroenterology, gynecology, hematology, infectious diseases, mental health (social work), general neurology, nutrition, primary care, pulmonary, renal, rheumatology, sleep medicine, Women’s Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)',
                telephone: '(617) 732-9300',
            },
            {
                directory_id: 10,
                service: 'Laboratory',
                specialty: 'Blood work, lab services',
                telephone: '(617) 732-9841',
            },
            {
                directory_id: 11,
                service: 'Multi-Specialty Clinic',
                specialty:
                    'Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine',
                telephone: '(617) 732-9500',
            },
            {
                directory_id: 12,
                service: 'Osher Clinical Center for Integrative Health',
                specialty:
                    'Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.',
                telephone: '(617) 732-9700',
            },
            {
                directory_id: 13,
                service: 'Patient Financial Services',
                specialty: 'Patient financial counselling',
                telephone: '(617) 732-9677',
            },
            {
                directory_id: 14,
                service: 'Pharmacy',
                specialty: 'Outpatient pharmacy services',
                telephone: '(617) 732-9040',
            },
            {
                directory_id: 15,
                service: 'Radiology',
                specialty: 'Bone density, Breast imaging/Mammography, ultrasound, X-Ray',
                telephone: '(617) 732-9801',
            },
            {
                directory_id: 16,
                service: 'Radiology, MRI/CT scan',
                specialty: 'CT scan, MRI, X-Ray',
                telephone: '(617) 732-9821',
            },
            {
                directory_id: 17,
                service: 'Rehabilitation Services',
                specialty:
                    'Orthopedic, sports, neurologic and vestibular Physical Therapy, Men’s and Women’s pelvic floor Physical Therapy. Hand/Occupational Therapy, Speech Language Pathology',
                telephone: '(617) 732-9525',
            },
        ],
        skipDuplicates: true,
    });
    const createLocations = await client.location.createMany({
        data: [
            {
                directory_id: 0,
                floor: 3,
                suite: '301',
            },
            {
                directory_id: 0,
                floor: 5,
                suite: '540',
            },
            {
                directory_id: 1,
                floor: 2,
                suite: '210',
            },
            {
                directory_id: 2,
                floor: 3,
                suite: '317',
            },
            {
                directory_id: 3,
                floor: 5,
                suite: '575',
            },
            {
                directory_id: 4,
                floor: 4,
                suite: '428',
            },
            {
                directory_id: 4,
                floor: 5,
                suite: '530',
            },
            {
                directory_id: 5,
                floor: 3,
                suite: '303',
            },
            {
                directory_id: 6,
                floor: 3,
                suite: '320',
            },
            {
                directory_id: 7,
                floor: 2,
                suite: '201',
            },
            {
                directory_id: 8,
                floor: 2,
                suite: '202',
            },
            {
                directory_id: 9,
                floor: 4,
                suite: '402',
            },
            {
                directory_id: 10,
                floor: 1,
                suite: '100',
            },
            {
                directory_id: 11,
                floor: 1,
                suite: '130',
            },
            {
                directory_id: 12,
                floor: 4,
                suite: '422',
            },
            {
                directory_id: 13,
                floor: 2,
                suite: '204B',
            },
            {
                directory_id: 14,
                floor: 3,
                suite: '317',
            },
            {
                directory_id: 15,
                floor: 5,
                suite: '560',
            },
            {
                directory_id: 16,
                floor: 1,
                suite: '102B',
            },
            {
                directory_id: 17,
                floor: 2,
                suite: '200',
            },
        ],
        skipDuplicates: true,
    });
    const createOpeningHours = await client.openingHours.createMany({
        data: [
            {
                directory_id: 1,
                start_day: 'Monday',
                end_day: 'Friday',
                open_time: new Date(0, 0, 0, 8, 0),
                close_time: new Date(0, 0, 0, 16, 30),
                excludes_holidays: false,
            },
            {
                directory_id: 10,
                start_day: 'Monday',
                end_day: 'Friday',
                open_time: new Date(0, 0, 0, 7, 0),
                close_time: new Date(0, 0, 0, 18, 30),
                excludes_holidays: true,
            },
            {
                directory_id: 10,
                start_day: 'Saturday',
                end_day: 'Saturday',
                open_time: new Date(0, 0, 0, 9, 0),
                close_time: new Date(0, 0, 0, 13, 0),
                excludes_holidays: true,
            },
            {
                directory_id: 14,
                start_day: 'Monday',
                end_day: 'Friday',
                open_time: new Date(0, 0, 0, 9, 0),
                close_time: new Date(0, 0, 0, 16, 0),
                excludes_holidays: true,
            },
        ],
        skipDuplicates: true,
    });
}

main().then(() => console.log('Temp Data Loaded'));

// Export the client
export default client;
