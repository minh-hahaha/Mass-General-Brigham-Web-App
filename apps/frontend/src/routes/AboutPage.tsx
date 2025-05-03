import { motion } from 'framer-motion';
import Member from '../components/Member';
import MemberPair from '../components/MemberPair';

const AboutPage = () => {
    return (
        <div className="bg-gray-200 h-2full max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 px-24 py-12 text-left">
                <motion.div
                    className="font-semibold text-4xl text-center pb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.25 }}
                >
                    Meet the Developers of Team C
                </motion.div>
                <div className="grid grid-cols-1 px-10 gap-4 transition-[delay-150 duration-300 ease-in-out]">

                    <MemberPair ordinal={0}>
                        <Member
                            image={'AdMinh.jpg'}
                            name={'Minh Ha'}
                            title={'Lead Software Engineer'}
                            github={'minh-hahaha'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'Andrew.png'}
                            name={'Andrew Melton'}
                            title={'Assistant Lead Software Engineer'}
                            github={'4ndrew13'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={1}>
                        <Member
                            image={'Pakorn.jpg'}
                            name={'Pakorn Liengsawangwong'}
                            title={'Assistant Lead Software Engineer'}
                            github={'pako490'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'max.png'}
                            name={'Max Jeronimo'}
                            title={'Backend / Databases'}
                            github={'max-jeronimo'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={2}>
                        <Member
                            image={'Jake.jpg'}
                            name={'Jake Lariviere'}
                            title={'Backend / Databases'}
                            github={'jlariv11'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'Jack.png'}
                            name={'Jack Morris'}
                            title={'Backend / Databases'}
                            github={'JackMorris1234'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={3}>
                        <Member
                            image={'Vinam.jpg'}
                            name={'Vinam Nguyen'}
                            title={'Algorithms / Project Manager'}
                            github={'vinamnguyen'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'Krish.png'}
                            name={'Krish Patel'}
                            title={'Algorithms / Scrum Master'}
                            github={'krishpate1'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={4}>
                        <Member
                            image={'Yael.jpg'}
                            name={'Yael Whitson'}
                            title={'Frontend / Documentation Analyst'}
                            github={'whywhitson'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'Sean.jpg'}
                            name={'Haotian Liu'}
                            title={'Frontend / Product Owner'}
                            github={'seanliu7081'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={5}>
                        <Member
                            image={'kai.png'}
                            name={'Kai Davidson'}
                            title={'Team Coach'}
                            github={'None'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'wwong2.jpg'}
                            name={'Wilson Wong'}
                            title={'Professor'}
                            github={'None'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <motion.div
                        className="font-semibold text-4xl pb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 2 }}
                    >
                        Special Thanks to:
                    </motion.div>

                    <MemberPair ordinal={7}>
                        <Member
                            image={'msgLogo.png'}
                            name={'Brigham and Women\'s Hospital'}
                            title={'Provided maps and data'}
                            github={'None'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                        <Member
                            image={'AndrewShinn.jpg'}
                            name={'Andrew Shinn'}
                            title={'Brigham and Women\'s Representative'}
                            github={'None'}
                            schoolYear={'xxx'}
                            quote={'xxx'}
                        />
                    </MemberPair>
                </div>
                <div className="pt-8">
                    The Brigham & Women's Hospital maps and data used in this application are
                    copyrighted and provided for the sole use of educational purposes.
                </div>
            </div>
        </div>
    );
}

export default AboutPage;