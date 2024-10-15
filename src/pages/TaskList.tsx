import { PencilIcon, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import dayjs from 'dayjs'; // Import dayjs if not already imported

import {
  listTheShifts,
  getTheStaff,
  getTheAdminStaffUser,
} from '../graphql/queries';
import * as mutation from '../graphql/mutations.js';

const TaskList = () => {
  const [stafflist, setStaffList] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [filter, setFilter] = useState('all'); // State to manage current filter

  const client = generateClient();
  const navigation = useNavigate();

  useEffect(() => {
    listShifts();
  }, []);

  useEffect(() => {
    applyFilter(); // Apply the filter whenever stafflist or filter changes
  }, [stafflist, filter]);

  const listShifts = async () => {
    try {
      const staffdata = await client.graphql({
        query: listTheShifts,
        variables: {},
      });

      const shiftsList = staffdata.data.listTheShifts.items;
      console.log('Fetched Shifts:', shiftsList);
      const sortedTasks = shiftsList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      const shiftsWithDetails = await Promise.all(
        sortedTasks.map(async (shift) => {
          let staffName = 'Unknown';
          let adminName = '';

          // Fetch staff name if `staffId` exists
          if (shift.staffId) {
            try {
              const staffData = await client.graphql({
                query: getTheStaff,
                variables: { id: shift.staffId },
              });

              staffName = staffData.data.getTheStaff.name;
            } catch (error) {
              console.error(
                `Error fetching staff name for ${shift.staffId}:`,
                error,
              );
            }
          }

          // Fetch admin name if `userId` exists
          if (shift.userId) {
            try {
              const adminData = await client.graphql({
                query: getTheAdminStaffUser,
                variables: { id: shift.userId },
              });

              adminName = adminData.data.getTheAdminStaffUser.name || 'Admin';
            } catch (error) {
              console.error(
                `Error fetching admin name for ${shift.userId}:`,
                error,
              );
            }
          }

          // Combine shift with staffName and adminName
          return { ...shift, staffName, adminName };
        }),
      );

      setStaffList(shiftsWithDetails); // Set the processed shift data in state
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const applyFilter = () => {
    const now = dayjs();
    let filtered;

    switch (filter) {
      case 'upcoming':
        filtered = stafflist.filter((shift) =>
          dayjs(shift.startDate).isAfter(now),
        );
        break;
      case 'previous':
        filtered = stafflist.filter((shift) =>
          dayjs(shift.endDate).isBefore(now),
        );
        break;
      default:
        filtered = stafflist;
        break;
    }

    setFilteredShifts(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: mutation.deleteTheShifts,
        variables: { input: { id } },
      });

      listShifts(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Shift List
        </h2>

        <button
          className="btn-grad w-[180px] pr-20"
          onClick={() => navigation(`/addTask/add`)}
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
          Add New Shift
        </button>
      </div>
      <div className="p-4 mb-6 ">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white shadow-lg text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('all')}
          >
            All Shifts
          </button>

          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'upcoming'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white text-gray-600  shadow-lg  border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming Shifts
          </button>

          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'previous'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white text-gray-600 shadow-lg  border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('previous')}
          >
            Previous Shifts
          </button>
        </nav>
      </div>

      <div className="overflow-x-auto mt-10">
  <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
    <thead className="bg-gradient-to-r from-[#4c4b4b] to-[#454545]">
      <tr>
        <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
          Location
        </th>
        <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
          Duties
        </th>
        <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
          Employee Name
        </th>
        <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
          Shift Time
        </th>
        <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
          Created By (Admin/Staff)
        </th>
        <th className="px-4 py-3 text-center text-white text-sm uppercase font-bold">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
      {filteredShifts.length === 0 ? (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center">
            No Data Found
          </td>
        </tr>
      ) : (
        filteredShifts.map((shift) => (
          <tr
            key={shift.id}
            className="hover:bg-gray-50 transition-all duration-200"
          >
            <td className="px-4 py-4 border-b align-middle">
              {shift.Location}
            </td>
            <td className="px-4 py-4 border-b align-middle">{shift.duties}</td>
            <td className="px-4 py-4 border-b align-middle">
              {shift.staffName ?? 'Unknown'}
            </td>
            <td className="px-4 py-4 border-b align-middle">
              {dayjs(shift.startTime).format('YYYY-MM-DD h:mm A')} -{' '}
              {dayjs(shift.endTime).format('h:mm A')}
            </td>
            <td className="px-4 py-4 border-b align-middle">
              {shift.adminName && shift.adminName.trim() !== ''
                ? shift.adminName
                : 'Admin'}
            </td>
            <td className="px-4 py-4 border-b align-middle text-center">
              <div className="flex justify-center space-x-4">
                <PencilIcon
                  onClick={() => navigation(`/addTask/edit/${shift.id}`)}
                  className="cursor-pointer hover:text-indigo-600 transform hover:scale-110 transition-all"
                  size={20}
                />
                <Trash2
                  onClick={() => handleDelete(shift.id)}
                  className="cursor-pointer hover:text-red-600 transform hover:scale-110 transition-all"
                  size={20}
                />
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

export default TaskList;
