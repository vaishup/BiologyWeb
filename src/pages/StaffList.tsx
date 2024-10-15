import { Dot, PencilIcon, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import UserTwo from '../images/greendot.png';

import {
  listTheShifts,
  getTheStaff,
  deleteTheShifts,
  listTheStaffs,
} from '../graphql/queries';
const StaffList = () => {
  const [stafflist, setStaffList] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    listStaff();
  }, []);
  const listStaff = async () => {
    const client = generateClient();
    try {
      const staffdata = await client.graphql({
        query: listTheStaffs,
        variables: {
          filter: {
            IsActive: {
              eq: 'Online', // Or true if IsActive is a boolean
            },
          },
        },
      });

      const shiftsList = staffdata.data.listTheStaffs.items;
      console.log('shiftsList...', shiftsList);
      // Sort the tasks by createdAt date
      const sortedTasks = shiftsList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      // Loop through each shift and fetch the staff name using staffId
      // Update the state with the shifts that now include staff names
      setStaffList(sortedTasks);
      console.log('Updated staff list with names:', sortedTasks);
    } catch (error) {
      console.error('Error fetching shifts or staff details:', error);
    }
  };
  const handleOpenMap = () => {
    const location = {
      latitude: 37.7749, // Example: Replace with your actual location coordinates
      longitude: -122.4194,
    };
    navigation('/MapScreen', { state: { location } });
    //navigation(`/MapScreen/${location.latitude}/${location.longitude}`);
  };
  const handleLocationClick = (latitude,longitude,location) => {
    //navigation('/MapScreen', { state: { latitude: latitude, longitude:longitude } });
    navigation('/MapScreen', { state: { latitude, longitude, location } }); // Navigate with state

  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Online Employee List
        </h2>

        {/* <button
          className="btn-grad w-[180px] pr-20"
          onClick={() => {
            navigation('/addstaff');
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add New Staff
        </button> */}
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gradient-to-r from-[#4c4b4b] to-[#454545]">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                First Name{' '}
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                Email
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                Phone Number
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                Location
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {stafflist.length === 0 ? (
              <tr>
                <td
                  colSpan={5} // Adjust the number based on the number of columns in your table
                  className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-center"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              stafflist.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.email}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.phoneNumber}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm" onClick={() =>handleLocationClick(order.latitude,order.longitude,order.Location)}>
                    {/* <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.Location)}`}
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer" // Security enhancement
                      className="text-blue-500 underline hover:text-blue-700"
                    > */}
                      {order.Location}
                    {/* </a> */}
                  </td>

                  <td className="border-b border-gray-200 bg-white text-sm flex-row">
                    <div className="flex flex-row">
                      <img
                        src={UserTwo}
                        className="w-[14px] h-[13px] mt-1"
                        alt="User"
                      />
                      <p className="ml-1 text-title-md1 font-bold text-green-700 dark:text-white">
                        Online
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default StaffList;
