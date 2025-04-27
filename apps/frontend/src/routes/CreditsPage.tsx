import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CreditsPage = () => {
    return (
        <div className="bg-gray-200 min-h-screen max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 px-24 py-24">
                <motion.div
                    className='font-semibold text-4xl pb-20'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                >
                    Powered by the PERN Stack & More
                </motion.div>

                <div className='grid grid-cols-1 px-10 gap-8'>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <CreditItem
                            picture="/TheTeam/AdMinh.jpg"
                            title="PostgreSQL"
                            description="Relational Database Management System"
                            link="https://www.postgresql.org/"
                        />
                        <CreditItem
                            picture="'/Credits/Shadcn.png'"
                            title="Shadcn"
                            description="UI Component Library"
                            link="https://ui.shadcn.com"
                        />

                    </motion.div>

                </div>
            </div>
        </div>
    )
}

const CreditItem = ({ picture, title, description, link }: { picture: string, title: string, description: string, link: string }) => {
    return (
        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
            <div
                className="rounded-full size-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${picture})` }}
            />
            <div className='grid grid-cols-1 text-codgray text-bold '>
                <div className='text-lg'>{title}</div>
                <div className='text-sm'>{description}</div>
                <div className='text-sm'>Website: <Link to={link} target='_blank' rel='noopener noreferrer' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>{link}</Link></div>
            </div>
        </div>
    )
}

export default CreditsPage;
