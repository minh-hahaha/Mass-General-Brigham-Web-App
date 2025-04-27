import { Link } from 'react-router-dom';
import React from 'react';

interface MemberProps {
    image: string,
    name: string,
    title: string,
    github: string
}

const Member = ({image, name, title, github}: MemberProps) => {
    if (github == "None") {
        return (
            <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                <div className={`rounded-full size-32 bg-cover bg-center`} style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                <div className='grid grid-cols-1 text-codgray text-bold '>
                    <div className='text-lg'>{name}</div>
                    <div className='text-sm'>{title}</div>
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
            <div className={`rounded-full size-32 bg-cover bg-center`} style={{ backgroundImage: `url(/TheTeam/${image})` }}  />
            <div className='grid grid-cols-1 text-codgray text-bold '>
                <div className='text-lg'>{name}</div>
                <div className='text-sm'>{title}</div>
                <div className='text-sm'>Github: <Link to={`https://github.com/${github}`} className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>@{github}</Link></div>
            </div>
        </div>
    );
}

export default Member;