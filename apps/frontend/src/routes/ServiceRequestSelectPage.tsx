import { motion } from 'framer-motion';

export default function ServiceRequestSelectPage() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center p-5 gap-12 bg-gradient-to-b from-slate-100 to-slate-300">
            {/* First Row - 3 vertical smaller card-style items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                {[1, 2, 3].map((num) => (
                    <motion.div
                        key={`row1-${num}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                        className="bg-white border border-gray-200 rounded-xl h-48 p-4 flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg overflow-hidden transition-transform duration-150 ease-out"
                    >
                        Link to Request {num}
                    </motion.div>
                ))}
            </div>

            {/* Second Row - 2 vertical smaller card-style items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
                {[1, 2].map((num) => (
                    <motion.div
                        key={`row2-${num}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                        className="bg-white border border-gray-200 rounded-xl h-48 p-4 flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg overflow-hidden transition-transform duration-150 ease-out"
                    >
                        Link to Request {num}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
