const axios = require('axios').default;
const data = axios.get('/directory');

function getData()  {
    for (let key in data) {
        let value = data[key];
    }

export default function DataTable() {

    return (
        <div className='flex justify-center py-20 h-screen'>
            <div className='w-120 h-120 border-3 rounded-lg'>
                Hello
            </div>
        </div>
    )
}