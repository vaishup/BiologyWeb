import {
  ChevronLeft,
  ChevronRight,
  Eye,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import React, { useState, useEffect, useRef } from 'react';
import * as mutation from '../graphql/mutations.js';
import { Modal } from 'antd';
import { getTheAdminStaffUser } from '../graphql/queries.js';
import { listTheStaffs } from '../graphql/queries.js';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb.js';
import { useLocation } from 'react-router-dom';

const Employee = () => {
  const location = useLocation(); // Access the navigation state
  const initialFilter = location.state?.filter || 'all'; // Default to 'all' if no filter is passed

  const client = generateClient({
    authMode: 'userPool', // Use Cognito User Pools authentication
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [show, setIsShow] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const navigation = useNavigate();

  const [stafflist, setStaffList] = useState([]);
  const handleDelete = async () => {
    try {
      console.log('Attempting to delete staff with ID:', selectedId);
      const response = await client.graphql({
        query: mutation.deleteTheStaff,
        variables: { input: { id: selectedId } },
        authMode: 'userPool',
      });
      console.log('Delete response:', response);
      setIsOpen(false);
      listStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  //GraphQL endpoint: https://kfh66zv2vrg4lmd7d63crztdei.appsync-api.us-east-2.amazonaws.com/graphql
  //GraphQL API KEY: da2-mttg3c4kpjgi3jgfvaelnjquji
  const [filteredStaffList, setFilteredStaffList] = useState([]); // Filtered list
  const [filter, setFilter] = useState(initialFilter || 'all'); // Initialize with the passed filter

  // Fetch staff list on component mount
  useEffect(() => {
    listStaff();
  }, []);

  const listStaff = async () => {
    const client = generateClient({
      authMode: 'userPool', // Use Cognito User Pools authentication
    });
    try {
      // Fetch staff list
      const staffdata = await client.graphql({
        query: listTheStaffs,
        variables: {},
        authMode: 'userPool',
      });

      const staffList = staffdata.data.listTheStaffs.items;
      console.log('Fetched Staff List:', staffList);

      // Sort the staff list by created date
      const sortedTasks = staffList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      // Enrich the staff list with admin names if userId exists
      const staffWithAdminNames = await Promise.all(
        sortedTasks.map(async (staff) => {
          let adminName = 'Admin'; // Default to 'Admin' if no admin user found

          // Fetch admin name if `userId` exists
          if (staff.userId) {
            try {
              const adminData = await client.graphql({
                query: getTheAdminStaffUser,
                variables: { id: staff.userId },
              });

              adminName = adminData.data.getTheAdminStaffUser?.name || 'Admin';
            } catch (error) {
              console.error(
                `Error fetching admin name for ${staff.userId}:`,
                error,
              );
            }
          }

          // Return the staff object with adminName added
          return { ...staff, adminName };
        }),
      );

      setStaffList(staffWithAdminNames); // Set the full staff list
      setFilteredStaffList(staffWithAdminNames); // Initially display all staff
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  // Filter staff list based on the current filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredStaffList(stafflist); // Show all staff
    } else if (filter === 'assigned') {
      const assignedStaff = stafflist.filter(
        (staff) => staff.staffStatus === 'assigned',
      );
      setFilteredStaffList(assignedStaff); // Show only assigned staff
    }
  }, [filter, stafflist]);

  const filteredStaffs = filteredStaffList.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredStaffs.slice(startIdx, startIdx + itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
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
          className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 hover:text-white transition duration-200`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-3 py-1">
          ...
        </span>
      ),
    );
  };
  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDialogue = (id: string) => {
    console.log(id);
    setSelectedId(id);
    setIsShow(true);
    setIsOpen(true);
  };

  return (
    <>
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
            onClick={handleDelete}
          >
            OK
          </button>,
          ,
        ]}
      >
        <div className="flex flex-col items-center justify-center p-5">
          {/* Modal Content */}
          <p className="text-xl font-semibold text-center mb-2">
            Are you sure you want delete this employee?
          </p>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Employee List
        </h2>
        <button
          className="btn-grad w-[230px] pr-20"
          onClick={() => {
            navigation('/addclient');
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
          Add New Employee
        </button>
      </div>
      <div className="p-4 mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white text-gray-600 shadow-lg border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'assigned'
                ? 'bg-[#8c8c8c] text-white shadow-md'
                : 'bg-white text-gray-600 shadow-lg border-gray-300 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            onClick={() => setFilter('assigned')}
          >
            Assigned
          </button>
        </nav>
      </div>
      <div className="overflow-x-auto mt-10">
        {stafflist.length > 0 ? (
          <>
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gradient-to-r from-[#4c4b4b] to-[#454545]">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    PHONE NO
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    Profile Status
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Barcode
                  </th>
                  <th className="px-6 py-3 border-b text-white text-sm uppercase font-bold">
                    Created By 
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                      {order.employeeId}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                      {order.phoneNumber}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                      {order.email}
                    </td>
                    <td
                      className={`border-b border-black bg-white text-sm text-center ${
                        order.profileStatus === 'Incomplete'
                          ? 'text-yellow-600'
                          : order.profileStatus === 'Completed'
                            ? 'text-green-600'
                            : 'text-gray-600'
                      }`}
                    >
                      <div
                        className={`border w-22 px-1 py-1 rounded text-sm font-medium ${
                          order.profileStatus === 'Incomplete'
                            ? 'text-yellow-600 border-yellow-600 bg-yellow-50'
                            : order.profileStatus === 'Pending'
                              ? 'text-yellow-600 border-yellow-600 bg-yellow-50'
                              : order.profileStatus === 'Completed'
                                ? 'text-green-600 border-green-600 bg-green-100'
                                : 'text-gray-600 border-gray-400 bg-gray-100'
                        }`}
                      >
                        {order.profileStatus === 'Incomplete'
                          ? 'Pending'
                          : order.profileStatus === 'Pending'
                            ? 'Pending'
                            : order.profileStatus === 'Completed'
                              ? 'Completed'
                              : order.profileStatus}
                      </div>
                    </td>

                    <td className="px-6 py-4 border-b">
                      {order.scanNumber}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {order.adminName ?? 'Admin'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex-row">
                      <div className="flex flex-row">
                        <Eye
                          onClick={() => {
                            navigation(`/Profile/${order.id}?from=Employee`);
                          }}
                          className="mr-5 inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
                          color="black"
                          size={20}
                        />

                        <PencilIcon
                          onClick={() => {
                            navigation(`/addclient/${order.id}`);
                          }}
                          className="mr-5 inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
                          color="black"
                          size={20}
                        />
                        <Trash2
                          onClick={() => handleDialogue(order.id)}
                          className="inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
                          color="black"
                          size={20}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 space-x-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md  bg-white shadow-md text-gray-700 hover:bg-blue-400 hover:text-white transition duration-200"
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
                {Math.min(startIdx + itemsPerPage, filteredStaffs.length)} of{' '}
                {filteredStaffs.length}
              </div>

              {/* Items per page dropdown */}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 bg-white   rounded shadow-md text-gray-700"
              >
                {[10, 20, 50, 100].map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">No data found</div>
        )}
      </div>
    </>
  );
};
export default Employee;
