import client from '../../../apps/backend/src/bin/prisma-client.ts'


// Create the prisma client, this automatically connects to the database
//const prisma = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {

    const createManyBuildings = await client.building.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {

                building_name: 'Building0',

            },
        ],
        skipDuplicates: true,
    });
    const createManyDepartments = await client.department.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
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
        ],
        skipDuplicates: true,
    });
    const createManyLocations = await client.location.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
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
        ],
        skipDuplicates: true,
    });

    const createManyEmployees = await client.employee.createMany({
        data: [
            /*      
                                                                                                          yyyy:mm:dd */
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
main().then(() => console.log('Temp Data Loaded'));


