import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Member from '../components/Member.tsx';
import MemberPair from '../components/MemberPair.tsx';

const AboutPage = () => {
    return(
        <div className="bg-gray-200 h-2full max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 px-24 py-24">
                <motion.div className='font-semibold text-4xl pb-20'
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5}}>
                    Meet the Developers of Team C
                </motion.div>
                <div className='grid grid-cols-1 px-10 gap-4 transition-[delay-150 duration-300 ease-in-out]'>

                    <MemberPair ordinal={0}>
                        {Member('AdMinh.jpg', 'Minh Ha', 'Lead Software Engineer', 'minh-hahaha')}
                        {Member('Andrew.png', 'Andrew Melton', 'Assistant Lead Software Engineer', '4ndrew13')}
                    </MemberPair>

                    <MemberPair ordinal={1}>
                        {Member('Pakorn.jpg', 'Pakorn Liengsawangwong', 'Assistant Lead Software Engineer', 'pako490')}
                        {Member('max.png', 'Max Jeronimo', 'Backend / Databases', 'max-jeronimo')}
                    </MemberPair>

                    <MemberPair ordinal={2}>
                        {Member('Jake.jpg', 'Jake Lariviere', 'Backend / Databases', 'jlariv11')}
                        {Member('Jack.png', 'Jack Morris', 'Backend / Databases', 'JackMorris1234')}
                    </MemberPair>

                    <MemberPair ordinal={3}>
                        {Member('Vinam.jpg', 'Vinam Nguyen', 'Algorithms / Project Manager', 'vinamnguyen')}
                        {Member('Krish.png', 'Krish Patel', 'Algorithms / Scrum Master', 'krishpate1')}
                    </MemberPair>

                    <MemberPair ordinal={4}>
                        {Member('Yael.jpg', 'Yael Whitson', 'Frontend / Documentation Analyst', 'whywhitson')}
                        {Member('Sean.jpg', 'Haotian Liu', 'Frontend / Product Owner', 'seanliu7081')}
                    </MemberPair>

                    <MemberPair ordinal={5}>
                        {Member('kai.png', 'Kai Davidson', 'Team Coach', 'None')}
                        {Member('wwong2.jpg', 'Wilson Wong', 'Professor', 'None')}
                    </MemberPair>
                </div>
                <div className='pt-8'>
                    The Brigham & Women’s Hospital maps and data used in this application are copyrighted and provided for the sole use of educational purposes.
                </div>
            </div>
        </div>
    )
}

export default AboutPage;