import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import transportationIcon from '../assets/icons/transportation.png';
import medicalDeviceIcon from '../assets/icons/medicaldevice.png';
import maintenanceIcon from '../assets/icons/maintenance.png';
import sanitationIcon from '../assets/icons/sanitation.png';
import translationIcon from '../assets/icons/translation.png';

export default function ServiceRequestSelectPage() {
    const navigate = useNavigate();

    const animationProps = {
        whileHover: { scale: 1.10 },
        whileTap: { scale: 0.90 },
        transition: {
            type: 'tween',
            ease: [0.5, 0, 0.75, 0], // custom: fast start, snappy end
            duration: 0.12,
        }
    };

    const cardStyle = "bg-white border border-gray-200 rounded-xl h-80 w-64 p-4 flex flex-col items-center justify-center gap-4 text-lg font-semibold shadow-md hover:shadow-lg transition-transform";

    // Updated with icon properties
    const firstRowRequests = [
        { label: 'Transportation', path: '/TransportationRequestPage', icon: transportationIcon },
        { label: 'Medical Device', path: '/MedicalDevicePage', icon: medicalDeviceIcon },
        { label: 'Maintenance', path: '/MaintenancePage', icon: maintenanceIcon },
    ];

    const secondRowRequests = [
        { label: 'Sanitation', path: '/SanitationRequest', icon: sanitationIcon },
        { label: 'Translation', path: '/TranslationServiceRequestPage', icon: translationIcon },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center items-center p-8 gap-4 bg-gradient-to-b from-slate-100 to-slate-300">
            {/* First Row */}
            <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
                {firstRowRequests.map((req, i) => (
                    <motion.div
                        key={`row1-${i}`}
                        onClick={() => navigate(req.path)}
                        {...animationProps}
                        className={cardStyle}
                    >
                        <img
                            src={req.icon}
                            alt={`${req.label} icon`}
                            className="w-50 h-50 mb-4"
                        />
                        {req.label}
                    </motion.div>
                ))}
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
                {secondRowRequests.map((req, i) => (
                    <motion.div
                        key={`row2-${i}`}
                        onClick={() => navigate(req.path)}
                        {...animationProps}
                        className={cardStyle}
                    >
                        <img
                            src={req.icon}
                            alt={`${req.label} icon`}
                            className="w-50 h-50 mb-4"
                        />
                        {req.label}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
