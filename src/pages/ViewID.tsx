import { ChevronLeft, ChevronRight, Eye,
  PencilIcon, } from 'lucide-react';
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

import {
  getTableID,
  getUserInfo,
  getCustomAttributes,
} from '../hooks/authServices.js';

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

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    employeeId: '',
    scanNumber: '',
  });
  const handleDialogue = () => {
    setIsShow(true);
    setIsOpen(false);
  };
  const [errors, setErrors] = useState({});

  const handleCancle = () => {
    setIsOpen(false);
    navigation('/ViewID');
  };
  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fetch User ID
    const userId = await getTableID().catch((err) => {
      console.error('Error fetching User ID:', err);
      return null;
    });
    console.log('Fetched User ID:', userId);
    let user = null;
    if (userId) {
      user = await getUserInfo(userId).catch((err) => {
        console.error('Error fetching User Info:', err);
        return null;
      });
      console.log('User Info:', user);
    }
    // Validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.error('Validation Errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    // Create or Update Staff
    try {
      const staffInput = {
        id: formData.id,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        employeeId: formData.employeeId,
        profileStatus: id ? formData.status : 'Incomplete',
        userId: userId,
        DOB: '24',
      // photourl: '2e2e',
        isBiomatritcs: '', // ✅ Fixed from `isBiomatritcs` to `isBiometrics`
        Location: '', // ✅ Fixed casing (`Location` → `location`)
        IsActive: '', // ✅ Fixed casing (`IsActive` → `isActive`)
        latitude: '',
        longitude: '',
        shiftIds: '',
       staffStatus: '',
         scanNumber: formData.scanNumber,
      };

      let staffResponse;
      staffResponse = await client.graphql({
        query: mutation.createTheStaff,
        variables: { input: staffInput },
      });

      const createdItem =
        staffResponse.data.createTheStaff || staffResponse.data.updateTheStaff;
      console.log('Success:', createdItem.id);

      const updateInput = {
        id: createdItem.id,
        isLogin: 'true', // Store image URL in DB
      };
      console.log('Updating client with:', updateInput);
      const updateResponse = await client.graphql({
        query: mutation.updateTheViewIDUser,
        variables: { input: updateInput },
      });
      setIsOpen(true);
      navigation('/Employee');
    } catch (error) {
      console.error('Error creating', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate and restrict phone number
    if (name === 'phoneNumber') {
      // Allow only numeric input
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: 'Phone number must contain only numbers',
        }));
        return; // Stop updating the state
      }

      // Restrict to 10 digits
      if (value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: 'Phone number must be exactly 10 digits',
        }));
        return; // Stop updating the state
      } else if (value.length < 10 && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: 'Phone number must be exactly 10 digits',
        }));
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: '' })); // Clear error if valid
      }
    }

    // Update formData for all fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const OpenModal = (item) => {
    setIsOpen(true);
    setFormData({
      id: item.id || '',
      name: item.name || '',
      email: '',
      phoneNumber: '',
      status: '',
      employeeId: item.employeeId || '',
      scanNumber: item.scanNumber || '',
    });
  };
  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancle}
        footer={[
          <button
            className="text-black mr-5 h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
            key="cancel"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>,
        ]}
      >
        <div className="flex flex-col items-center justify-center p-5">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-[430px] justify-center items-center p-5">
              <div className="w-full">
                <label className="mb-2.5 mt-2 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="w-full">
                <label className="mb-2.5 mt-2 block text-black dark:text-white">
                  Phone Number <span className="text-meta-1">*</span>
                </label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your Phone Number"
                  className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${
                    errors.phoneNumber
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-stroke dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  }`}
                />
              </div>
              <button className="w-full mt-10 btn-grad pr-20" type="submit">
                Submit
              </button>
            </div>
          </form>
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
                  <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                    Barcode
                  </th>

                  {/* <th className="px-6 py-3 border-b text-white text-sm uppercase font-bold">
                    Created By (Admin/Staff)
                  </th> */}
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
                      {order.scanNumber}
                    </td>
                    {/* <td className="px-6 py-4 border-b text-center">
                      {order.adminName ?? 'Admin'}
                    </td> */}

                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex-row">
                      <div className="flex flex-row">
                      <Eye
                          onClick={() => {
                            navigation(`/ViewIdDetails/${order.id}?from=View ID`);
                          }}
                          className="mr-5 inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
                          color="black"
                          size={20}
                        />

                        <PencilIcon
                          onClick={() => {
                            navigation(`/EditViewId/${order.id}`);
                          }}
                          className="mr-5 inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
                          color="black"
                          size={20}
                        />
                        {order.isLogin === 'false' ? (
                          <button
                            onClick={() => OpenModal(order)}
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                          >
                            Assign Login
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm italic">
                            Login Assigned
                          </span>
                        )}
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
