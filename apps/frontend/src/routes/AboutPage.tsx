import { motion } from 'framer-motion';
import Member from '../components/Member';
import MemberPair from '../components/MemberPair';
import team_pic from '../assets/team_picv2.png';

const AboutPage = () => {
    return (
        <div className="bg-gray-200 h-2full max-w-full overflow-x-hidden">
            {/* Full width image with no constraints */}
            <motion.div
                className="w-full mb-8 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
            >
                <div className="w-[100vw] h-[500px] left-[50%] right-[50%] mx-[-50vw] absolute overflow-hidden position-relative">
                    <img
                        src={team_pic}
                        alt="Team C"
                        className="w-full h-full object-fill"
                    />
                </div>
                <div style={{ height: '500px' }}></div> {/* Spacer to maintain layout flow */}
            </motion.div>

            <div className="container mx-auto grid grid-cols-1 px-24 py-12 text-left">
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
                            schoolYear={'Class of 2027'}
                            major={'Computer Science'}
                            quote={'Very nice.'}
                        />
                        <Member
                            image={'Andrew.png'}
                            name={'Andrew Melton'}
                            title={'Assistant Lead Software Engineer'}
                            github={'4ndrew13'}
                            schoolYear={'Class of 2027'}
                            major={'Computer Science and Data Science'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={1}>
                        <Member
                            image={'Pakorn.jpg'}
                            name={'Pakorn Liengsawangwong'}
                            title={'Assistant Lead Software Engineer'}
                            github={'pako490'}
                            schoolYear={'Class of 2027'}
                            major={'Computer Science'}
                            quote={'I will fix it later'}
                        />
                        <Member
                            image={'max.png'}
                            name={'Max Jeronimo'}
                            title={'Backend / Databases'}
                            github={'max-jeronimo'}
                            schoolYear={'Class of 2027'}
                            major={'Computer Science'}
                            quote={'xxx'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={2}>
                        <Member
                            image={'Jake.jpg'}
                            name={'Jake Lariviere'}
                            title={'Assistant Lead Software Engineer'}
                            github={'jlariv11'}
                            schoolYear={'Class of 2026'}
                            major={'Computer Science and IMGD'}
                            quote={'RIP CSV parser'}
                        />
                        <Member
                            image={'Jack.png'}
                            name={'Jack Morris'}
                            title={'Backend / Databases'}
                            github={'JackMorris1234'}
                            schoolYear={'Class of 2026'}
                            major={'Computer Science'}
                            quote={'Where is my ERD?'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={3}>
                        <Member
                            image={'Vinam.jpg'}
                            name={'Vinam Nguyen'}
                            title={'Algorithms / Project Manager'}
                            github={'vinamnguyen'}
                            schoolYear={'Class of 2027'}
                            major={'Computer Science'}
                            quote={'WE DID IT!'}
                        />
                        <Member
                            image={'Krish.png'}
                            name={'Krish Patel'}
                            title={'Assistant Lead Software Engineer'}
                            github={'krishpate1'}
                            schoolYear={'Class of 2027'}
                            major={'Computer Science'}
                            quote={'Whose booking the room for the meeting?'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={4}>
                        <Member
                            image={'Yael.jpg'}
                            name={'Yael Whitson'}
                            title={'Frontend / Documentation Analyst'}
                            github={'whywhitson'}
                            schoolYear={'Class of 2026'}
                            major={'Robotics Engineering'}
                            quote={'I sure hope I remembered to submit the tracking doc!'}
                        />
                        <Member
                            image={'Sean.jpg'}
                            name={'Haotian(Sean) Liu'}
                            title={'Frontend / Product Owner'}
                            github={'seanliu7081'}
                            schoolYear={'Class of 2025'}
                            major={'Robotics Engineering and Mathematics'}
                            quote={'I need sleep'}
                        />
                    </MemberPair>

                    <MemberPair ordinal={5}>
                        <Member
                            image={'kai.png'}
                            name={'Kai Davidson'}
                            title={'Team Coach'}
                            github={'None'}
                            schoolYear={'None'}
                            major={'None'}
                            quote={'None'}
                        />
                        <Member
                            image={'wwong2.jpg'}
                            name={'Wilson Wong'}
                            title={'Professor'}
                            github={'None'}
                            schoolYear={'None'}
                            major={'None'}
                            quote={'None'}
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
                            schoolYear={'None'}
                            major={'None'}
                            quote={'None'}
                        />
                        <Member
                            image={'AndrewShinn.jpg'}
                            name={'Andrew Shinn'}
                            title={'Brigham and Women\'s Representative'}
                            github={'None'}
                            schoolYear={'None'}
                            major={'None'}
                            quote={'None'}
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