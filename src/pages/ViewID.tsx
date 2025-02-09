import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import React, { useState, useEffect, useRef } from 'react';
import * as mutation from '../graphql/mutations.js';
import { Modal } from 'antd';
import { getTheAdminStaffUser } from '../graphql/queries.js';
import { listTheViewIDUsers } from '../graphql/queries.js';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ViewID = () => {
  const client = generateClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [show, setIsShow] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const navigation = useNavigate();
  const [stafflist, setStaffList] = useState([]);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [prevFileUri, setPrevFileUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  let id = '';
  const handleDelete = async () => {
    try {
      console.log('Attempting to delete staff with ID:', selectedId);
      const response = await client.graphql({
        query: mutation.deleteTheStaff,
        variables: { input: { id: selectedId } },
        apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji',
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
  // Fetch staff list on component mount
  useEffect(() => {
    listStaff();
  }, []);
  const listStaff = async () => {
    const client = generateClient();
    try {
      // Fetch staff list
      const staffdata = await client.graphql({
        query: listTheViewIDUsers,
        variables: {},
      });

      const staffList = staffdata.data.listTheViewIDUsers.items;
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

  const downloadFromS3 = async ({
    folder,
    subFolder,
    fullPath,
    setFileUrl,
  }: {
    folder?: string;
    subFolder?: string;
    fullPath?: string;
    setFileUrl: (url: string) => void;
  }) => {
    try {
      if (fullPath) {
        const url = (await getUrl({ path: fullPath })).url;
        setFileUrl(`${url}`);
      } else {
        const folderPath = `public/User/${folder}/${id}/${
          subFolder ? `${subFolder}/` : ''
        }`;
        const filePath = (await list({ path: folderPath })).items[0]?.path;
        const url = (await getUrl({ path: filePath })).url;
        setFileUrl(`${url}`);
      }
    } catch (Error) {
      console.log('Error downloading from S3 ', Error);
    }
  };

  useEffect(() => {
    const downloadFile = async () => {
      await downloadFromS3({
        folder: 'userprofile',
        subFolder: 'selfie',
        setFileUrl: (url) => {
          setFileUri(url);
          setPrevFileUri(url);
          console.log('url', url);
        },
      });
      setIsLoading(false);
    };
    downloadFile();
  }, []);
  const handleDownloadXLSX = () => {
    if (stafflist.length === 0) {
      console.warn('No data to download.');
      return;
    }
  
    // 1️⃣ **Prepare Data for Excel**
    const excelData = stafflist.map((staff) => ({
      'Employee ID': staff.employeeId,
      Name: staff.name,
      'Profile Picture URL': staff.attachment?.[0]
        ? `https://bilogicf9acb70525e045b5bb09a6bbb423cf3c8e024-staging.s3.us-east-2.amazonaws.com/public/${staff.attachment}`
        : 'No Image',
    }));
  
    // 2️⃣ **Create Workbook & Worksheet**
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
  
    // 3️⃣ **Add Headers with Merged Styling Trick**
    const headerRow = [['EMPLOYEE ID', 'NAME', 'PROFILE PICTURE URL']];
    XLSX.utils.sheet_add_aoa(ws, headerRow, { origin: 0 });
  
    // 4️⃣ **Insert Empty Row for Better Spacing**
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 1 });
  
    // 5️⃣ **Insert Data Starting from Row 3**
    XLSX.utils.sheet_add_json(ws, excelData, {
      skipHeader: true, // Prevent duplicate headers
      origin: 2, // Start data at row 3
    });
  
    // 6️⃣ **Set Column Widths**
    ws['!cols'] = [
      { wch: 20 }, // Employee ID
      { wch: 25 }, // Name
      { wch: 60 }, // Profile Picture URL (Wider)
    ];
  
    // 7️⃣ **Append Sheet & Generate File**
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    saveAs(data, `Employee_IDs.xlsx`);
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
          Employee ID Management
        </h2>
        <button
          className="btn-grad w-[230px] pr-20"
          onClick={handleDownloadXLSX}
        >
          Download Xslv
        </button>
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

                  <th className="px-6 py-3 border-b text-white text-sm uppercase font-bold">
                    Created By (Admin/Staff)
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

                    <td className="px-6 py-4 border-b text-center">
                      {order.adminName ?? 'Admin'}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex-row">
                      <div className="flex flex-row">
                        <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
                          Assign Login
                        </button>
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
export default ViewID;
