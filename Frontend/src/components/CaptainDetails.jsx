import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-3'>
            <img className='h-10 w-10 rounded-full object-cover' src="https://scontent.fdac5-1.fna.fbcdn.net/v/t39.30808-6/476150041_606786368741878_3320369619406160204_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH2egGTj6MMstgYrnwaBz9UfPvvxU-rC7h8--_FT6sLuP3tBVIvDeWMz-i4jqVH05DhZDAod-Onkp8mVQ3gjJzX&_nc_ohc=0wV44hqrHe4Q7kNvwH0gWPg&_nc_oc=Adlp6ugaLjd5KmLMuKQNibadbiPX5-wTTfRPo5zet4fuxmFHFJsHY60QdUG2A8n93Nk&_nc_zt=23&_nc_ht=scontent.fdac5-1.fna&_nc_gid=90Z46YdpH_czQKchXB6U0Q&oh=00_AfSZt9O3xWSxQ_og1xnNWgPdBxs3VYr8o1KcP8YPlLPPlQ&oe=686EF089" alt="Driver's profile"/>
            <h4 className='text-lg font-medium'>Adnan Bin Wahid</h4>
          </div>
          <div>
            <h4 className='text-xl font-semibold'>$250.50</h4>
            <p className='text-sm text-gray-600'>Earned</p>
          </div>
         </div>
         <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-between items-start'>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-time-line"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours</p>

          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-speed-up-fill"></i>
            <h5 className='text-lg font-medium'>60</h5>
            <p className='text-sm text-gray-600'>mph</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
            <h5 className='text-lg font-medium'>8</h5>
            <p className='text-sm text-gray-600'>Trips</p>
          </div>

         </div>
    </div>
  )
}

export default CaptainDetails