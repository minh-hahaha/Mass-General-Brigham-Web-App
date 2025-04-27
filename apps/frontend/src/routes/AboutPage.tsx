import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return(
        <div className="bg-gray-200 h-2full max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 px-24 py-24">
                <motion.div className='font-semibold text-4xl pb-20 text-center'
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5}}>
                    Meet the Developers of Team C
                </motion.div>
                <div className='grid grid-cols-1 px-10 gap-4 transition-[delay-150 duration-300 ease-in-out]'>
                    <motion.div className="grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1}}
                    >
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/AdMinh.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Minh Ha</div>
                                <div className='text-sm'>Lead Software Engineer</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/minh-hahaha' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>minh-hahaha</Link></div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Andrew.png')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Andrew Melton</div>
                                <div className='text-sm'>Assistant Lead Software Engineer</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/4ndrew13' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>4ndrew13</Link></div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5}}
                    >
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Pakorn.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Pakorn Liengsawangwong</div>
                                <div className='text-sm'>Assistant Lead Software Engineer</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/pako490' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>pako490</Link></div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/max.png')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Max Jeronimo</div>
                                <div className='text-sm'>Backend / Databases</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/max-jeronimo' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>max-jeronimo</Link></div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2}}
                    >
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Jake.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Jake Lariviere</div>
                                <div className='text-sm'>Backend / Databases</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/jlariv11' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>jlariv11</Link></div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Jack.png')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Jack Morris</div>
                                <div className='text-sm'>Backend / Databases</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/JackMorris1234' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>JackMorris1234</Link></div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.5}}
                    >
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Vinam.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Vinam Nguyen</div>
                                <div className='text-sm'>Algorithms / Project Manager</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/vinamnguyen' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>vinamnguyen</Link></div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Krish.png')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Krish Patel</div>
                                <div className='text-sm'>Algorithms / Scrum Master</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/krishpate1' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>krishpate1</Link></div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3}}
                    >
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Yael.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Yael Whitson</div>
                                <div className='text-sm'>Frontend / Documentation Analyst</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/whywhitson' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>whywhitson</Link></div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                            <div className="rounded-full size-32 bg-cover bg-center bg-[url('/TheTeam/Sean.jpg')]" />
                            <div className='grid grid-cols-1 text-codgray text-bold '>
                                <div className='text-lg'>Haotian Liu</div>
                                <div className='text-sm'>Frontend / Product Owner</div>
                                <div className='text-sm'>Github: <Link to='https://github.com/seanliu7081' className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>seanliu7081</Link></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/*</motion.div>*/}
            </div>
        </div>
    )
}

export default AboutPage;