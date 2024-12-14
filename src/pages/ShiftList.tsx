import { ChevronLeft, ChevronRight, PencilIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import dayjs from 'dayjs'; // Import dayjs if not already imported
import { Modal } from 'antd';

import {
  listTheShifts,
  getTheStaff,
  getTheAdminStaffUser,
} from '../graphql/queries.js';
import * as mutation from '../graphql/mutations.js';

const ShiftList = () => {
  const [stafflist, setStaffList] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [filter, setFilter] = useState('today'); // State to manage current filter
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
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

      const sortedTasks = shiftsList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      const shiftsWithDetails = await Promise.all(
        sortedTasks.map(async (shift) => {
          let staffName = 'Unknown';
          let employeeId = 'Unknown';
          let adminName = '';

          // Fetch staff name if `staffId` exists
          if (shift.staffId) {
            try {
              const staffData = await client.graphql({
                query: getTheStaff,
                variables: { id: shift.staffId },
              });

              staffName = staffData.data.getTheStaff.name;
              employeeId = staffData.data.getTheStaff.employeeId;
              //console.log(staffData.data.getTheStaff.employeeId);
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
          return { ...shift, staffName, adminName, employeeId };
        }),
      );

      setStaffList(shiftsWithDetails); // Set the processed shift data in state
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const applyFilter = () => {
    const now = dayjs(); // Current date and time
    const todayStart = now.startOf('day'); // Start of today
    const todayEnd = now.endOf('day'); // End of today

    let filtered;

    switch (filter) {
      case 'upcoming':
        // Shifts with a start time after the current time
        filtered = stafflist.filter((shift) =>
          dayjs(shift.startDate).isAfter(now),
        );
        break;

      case 'previous':
        // Shifts with an end time before the current time
        filtered = stafflist.filter((shift) =>
          dayjs(shift.endDate).isBefore(now),
        );
        break;

      case 'today':
        // Shifts happening today
        filtered = stafflist.filter((shift) => {
          const shiftDate = dayjs(shift.startDate);
          return shiftDate.isAfter(todayStart) && shiftDate.isBefore(todayEnd);
        });
        break;

      default:
        // Show all shifts if no filter is applied
        filtered = stafflist;
        break;
    }

    console.log('Filtered Shifts:', filtered); // Debug to verify the filtering
    setFilteredShifts(filtered); // Update state with the filtered shifts
  };

  const handleDelete = async (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const delet = async () => {
    try {
      await client.graphql({
        query: mutation.deleteTheShifts,
        variables: { input: { id: selectedId } },
        apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji',
      });
      setIsOpen(false);
      listShifts(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredShifts.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }
    return pages.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-md  ${
            currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700'
          } transition duration-200 hover:bg-blue-400 hover:text-white`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-3 py-1 text-gray-700">
          ...
        </span>
      ),
    );
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Shift List
        </h2>

        <Modal
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={[
            <button
              className="text-black mr-5  h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
              key="back"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>,
            <button
              className="text-white h-[30px]  w-[60px] bg-green-500 hover:bg-green-600 border-none rounded-lg"
              key="back"
              onClick={delet}
            >
              OK
            </button>,

            ,
          ]}
        >
          <div className="flex flex-col items-center justify-center p-5">
            {/* Modal Content */}
            <p className="text-xl font-semibold text-center mb-2">
              Are you sure you want delete this Shift?
            </p>
          </div>
        </Modal>

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
              filter === 'today'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white text-gray-600 shadow-lg  border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('today')}
          >
            Today's Shifts
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
                Description
              </th>
              <th className="px-4 py-3 text-left text-white text-sm uppercase font-bold">
                Employee ID
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
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              paginatedData.map((shift) => (
                <tr
                  key={shift.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-4 border-b align-middle">
                    {shift.Location}
                  </td>
                  <td className="px-4 py-4 border-b align-middle">
                    {shift.duties}
                  </td>
                  <td className="px-4 py-4 border-b align-middle">
                    {shift.employeeId}
                  </td>
                  <td className="px-4 py-4 border-b align-middle">
                    {shift.staffName ?? 'Unknown'}
                  </td>

                  <td className="px-4 py-4 border-b align-middle">
                    {`${shift.startDate} - ${
                      dayjs(
                        `2024-12-07 ${shift.endDate}`,
                        'YYYY-MM-DD hh:mm A',
                      ).isValid()
                        ? dayjs(
                            `2024-12-07 ${shift.endDate}`,
                            'YYYY-MM-DD hh:mm A',
                          ).format('hh:mm A')
                        : 'Invalid Date'
                    }`}
                  </td>

                  <td className="px-4 py-4 border-b align-middle">
                    {shift.adminName && shift.adminName.trim() !== ''
                      ? shift.adminName
                      : 'Admin'}
                  </td>
                  <td className="px-4 py-4 border-b align-middle text-center">
                    <div className="flex justify-center space-x-4">
                      <PencilIcon
                        onClick={() =>
                          navigation(`/addTask/edit/${shift.id}?from=ShiftList`)
                        }
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

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4 space-x-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md  bg-white  text-gray-700 hover:bg-blue-400 hover:text-white transition duration-200"
            >
              <ChevronLeft color="gray" />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md  bg-white  text-gray-700 hover:bg-blue-400 hover:text-white transition duration-200"
            >
              <ChevronRight color="gray" />
            </button>
          </div>

          {/* Results info */}
          <div className="text-gray-600">
            Results: {startIdx + 1} -{' '}
            {Math.min(startIdx + itemsPerPage, filteredShifts.length)} of{' '}
            {filteredShifts.length}
          </div>

          {/* Items per page dropdown */}
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-3 py-1 bg-white  border-gray-300 rounded shadow-md text-gray-700"
          >
            {[10, 20, 50, 100].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ShiftList;
