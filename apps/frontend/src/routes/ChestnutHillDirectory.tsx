import React from 'react';
import DirectoryItemComponent from '../components/DirectoryItemComponent.tsx';



const ChestnutHillDirectory = () => {
    const directoryData = [
        {
            name: "Allergy and Clinical Immunology",
            services: "Allergy (environmental, food, medication, and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiency",
            floor: "3rd floor, suite 301 5th floor, suite 540",
            phone: "(617) 732-9850",
            category: "medical"
        },
        {
            name: "Backup Child Care Center",
            services: "Backup childcare for employees (Monday – Friday, 8 am–4:30 pm)",
            floor: "2nd floor, suite 210",
            phone: "(617) 732-9543",
            category: "support"
        },
        {
            name: "Brigham Dermatology Associates (BDA)",
            services: "Medical and surgical dermatology",
            floor: "3rd floor, suite 317",
            phone: "(617) 732-9080",
            category: "medical"
        },
        {
            name: "Brigham Obstetrics and Gynecology Group (BOGG)",
            services: "Gynecology, obstetrics",
            floor: "5th floor, suite 575",
            phone: "(617) 732-9100",
            category: "medical"
        },
        {
            name: "Brigham Physicians Group (BPG)",
            services: "Adult primary care",
            floor: "4th floor, suite 428 5th floor, suite 530",
            phone: "(617) 732-9900",
            category: "medical"
        },
        {
            name: "Brigham Psychiatric Specialties",
            services: "Psychiatry, psychology, social work",
            floor: "3rd floor, suite 303",
            phone: "(617) 732-9811",
            category: "medical"
        },
        {
            name: "Center for Pain Medicine",
            services: "Multidisciplinary pain management",
            floor: "3rd floor, suite 320",
            phone: "(617) 732-9060",
            category: "medical"
        },
        {
            name: "Crohn's and Colitis Center",
            services: "Crohn's disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis",
            floor: "2nd floor, suite 201",
            phone: "(617) 732-6389",
            category: "medical"
        },
        {
            name: "Endoscopy Center",
            services: "Bacterial overgrowth breath test, colonoscopy, H. Pylori breath test, lactose malabsorption breath test, upper endoscopy",
            floor: "2nd floor, suite 202",
            phone: "(617) 732-7426",
            category: "medical"
        },
        {
            name: "Gretchen S. and Edward A. Fish Center for Women's Health",
            services: "Cardiology, dermatology (cosmetic, medical, and surgical), endocrinology, gastroenterology, gynecology, hematology, infectious diseases, mental health (social work), general neurology, nutrition, primary care, pulmonary, renal, rheumatology, sleep medicine, Women's Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)",
            floor: "4th floor, suite 402",
            phone: "(617) 732-9300",
            category: "medical"
        },
        {
            name: "Laboratory",
            services: "Blood work, lab services (Monday – Friday, 7 am–6:30 pm, Saturday, 9 am–1 pm, excluding holidays)",
            floor: "1st floor, suite 100",
            phone: "(617) 732-9841",
            category: "services"
        },
        {
            name: "Multi-Specialty Clinic",
            services: "Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine",
            floor: "1st floor, suite 130",
            phone: "(617) 732-9500",
            category: "medical"
        },
        {
            name: "Osher Clinical Center for Integrative Health",
            services: "Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.",
            floor: "4th floor, suite 422",
            phone: "(617) 732-9700",
            category: "wellness"
        },
        {
            name: "Patient Financial Services",
            services: "Patient financial counseling",
            floor: "2nd floor, suite 204B",
            phone: "(617) 732-9677",
            category: "support"
        },
        {
            name: "Radiology",
            services: "CT scan, MRI, X-Ray",
            floor: "1st floor, suite 102B",
            phone: "(617) 732-9040",
            category: "services"
        },
        {
            name: "Pharmacy",
            services: "Outpatient pharmacy services (Monday – Friday, 9 am–4 pm excluding holidays)",
            floor: "3rd floor, suite 317",
            phone: "(617) 732-9801",
            category: "services"
        },
        {
            name: "Radiology, MRI/CT scan",
            services: "Bone density, Breast imaging/ Mammography, ultrasound, X-Ray",
            floor: "5th floor, suite 560",
            phone: "(617) 732-9821",
            category: "services"
        },
        {
            name: "Rehabilitation Services",
            services: "Orthopedic, sports, neurologic and vestibular Physical Therapy, Men's and Women's pelvic floor Physical Therapy. Hand/Occupational Therapy, Speech Language Pathology",
            floor: "2nd floor, suite 200",
            phone: "(617) 732-9525",
            category: "medical"
        }
    ];
    return (
        <>
            {directoryData.map((item,index) => (
                <DirectoryItemComponent key={index} item={item}/>
            ))}
        </>

    );
};

export default ChestnutHillDirectory;
