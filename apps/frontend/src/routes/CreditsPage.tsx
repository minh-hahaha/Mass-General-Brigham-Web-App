import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const CreditsPage = () => {
    return (
        <div className="bg-gray-200 min-h-screen max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 px-24 py-24">
                <motion.div
                    className="font-semibold text-4xl pb-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.25 }}
                >
                    Credits Page
                </motion.div>

                <div className="grid grid-cols-1 px-10 gap-4">
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <CreditItem
                            picture="/Credits/PostgresSQL.png"
                            title="PostgreSQL"
                            description="Relational Database Management System"
                            version="v14.17"
                            link="https://www.postgresql.org/"
                        />
                        <CreditItem
                            picture="'/Credits/Expressjs.png'"
                            title="Express.js"
                            description="Web Application Web Framework"
                            version="v5.1.0"
                            link="https://expressjs.com"
                        />
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.75 }}
                    >
                        <CreditItem
                            picture="/Credits/React.png"
                            title="React"
                            description="JavaScript Library"
                            version="v19.1.0"
                            link="https://react.dev"
                        />
                        <CreditItem
                            picture="'/Credits/Nodejs.png'"
                            title="Node.js"
                            description="Open Source Runtime Environment"
                            version="v22.14.0"
                            link="https://nodejs.org/en"
                        />
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <CreditItem
                            picture="'/Credits/Shadcn.png'"
                            title="Shadcn"
                            description="UI Component Library"
                            version="v14.17"
                            link="https://ui.shadcn.com"
                        />
                        <CreditItem
                            picture="/Credits/Tailwind.png"
                            title="Tailwind"
                            description="CSS Framework"
                            version="v4.1.3"
                            link="https://tailwindcss.com"
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.25 }}
                    >
                        <CreditItem
                            picture="'/Credits/Webstorm.png'"
                            title="Jetbrains Webstorm"
                            description="IDE for our Application"
                            version="v2024.3.5"
                            link="https://www.jetbrains.com/webstorm/"
                        />
                        <CreditItem
                            picture="/Credits/Illustrator.png"
                            title="Adobe Illustrator"
                            description="Vector Graphics Editor"
                            version="v29.5"
                            link="https://www.adobe.com/products/illustrator.html"
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    >
                        <CreditItem
                            picture="'/Credits/ReactGoogleMaps.png'"
                            title="React Google Maps"
                            description="React Integration"
                            version="v1.5.2"
                            link="https://visgl.github.io/react-google-maps/"
                        />
                        <CreditItem
                            picture="/Credits/TexttoSpeech.png"
                            title="Google Text-to-Speech"
                            description="Text-to-Speech API"
                            version="v6.0.1"
                            link="https://cloud.google.com/text-to-speech"
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.75 }}
                    >
                        <CreditItem
                            picture="/Credits/Blender.jpg"
                            title="Blender"
                            description="Blender"
                            version="v4.4"
                            link="https://www.blender.com/"
                        />

                        <CreditItem
                            picture="/Credits/Threejs.jpg"
                            title="Three.js"
                            description="ThreeJS"
                            version="v0.176.0"
                            link="https://threejs.org"
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        >
                        <CreditItem
                            picture="/Credits/AuthO.png"
                            title="AuthO"
                            description="Authentification Service"
                            version="v2.1.1"
                            link="https://auth0.com/docs/get-started/auth0-overview"
                        />
                        <CreditItem
                            picture="/Credits/groq.png"
                            title="groq"
                            description="AI ASIC"
                            version=""
                            link="https://groq.com"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const CreditItem = ({
    picture,
    title,
    description,
    version,
    link,
}: {
    picture: string;
    title: string;
    description: string;
    version: string;
    link: string;
}) => {
    return (
        <div className="grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl">
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full size-32 bg-cover bg-center block"
                style={{ backgroundImage: `url(${picture})` }}
                aria-label={`Visit ${title} website`}
            />
            <div className="grid grid-cols-1 text-codgray text-bold ">
                <div className="text-lg">{title}</div>
                <div className="text-sm">{description}</div>
                <div className="text-sm">{version}</div>
            </div>
        </div>
    );
};

export default CreditsPage;
