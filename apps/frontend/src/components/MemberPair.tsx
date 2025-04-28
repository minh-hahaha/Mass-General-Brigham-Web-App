import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MemberPairProps {
    children: ReactNode;
    ordinal: number;
}

const MemberPair: React.FC<MemberPairProps> = ({children, ordinal}) => {

    const delaytime: number = 1 + (ordinal / 2);

    return (
        <motion.div className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: delaytime }}
        >
            {children}
        </motion.div>
    );
}

export default MemberPair;