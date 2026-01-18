import { categories } from '@/lib/constants'
import Filters from './FIlters.jsx'

const LeftSidebar = () => {
  return (
    <div className='border-r max-sm:hidden border-dark-4 min-h-[95vh] w-[200px] px-1 flex flex-col gap-2'>
        <div className=" w-full flex flex-col gap-0.5">
            <Filters categories={categories} />
        </div>
    </div>
  )
}

export default LeftSidebar
