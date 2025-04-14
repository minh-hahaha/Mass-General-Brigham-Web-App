import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

    const cardStyle = "bg-white border border-gray-200 rounded-xl h-80 w-64 p-4 flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg transition-transform";


    // TODO: EDIT PAGES TO GO WITH REQUESTS PAGES
    const firstRowRequests = [
        { label: 'Transportation', path: '/TransportationRequestPage' },
        { label: 'Medical Device', path: '/MedicalDevicePage' },
        { label: 'Maintenance', path: '/MaintenancePage' },
    ];

    const secondRowRequests = [
        { label: 'Sanitation', path: '/SanitationPage' },
        { label: 'Security', path: '/SecurityPage' },
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
                        {req.label}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
