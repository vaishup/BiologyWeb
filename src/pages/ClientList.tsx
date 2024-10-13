import { Eye, Pencil, PencilIcon, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import React, { useState, useEffect, useRef } from 'react';
import * as mutation from '../graphql/mutations.js';
import { Modal } from 'antd';
import { listTheShifts, getTheStaff,getTheAdminStaffUser } from '../graphql/queries';

import { listTheStaffs } from '../graphql/queries';
const ClientList = () => {
  const client = generateClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [show, setIsShow] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const navigation = useNavigate();
  const [stafflist, setStaffList] = useState([]);
  const handleDelete = async () => {
    try {
      // Confirm deletion with the user (optional)

      // Perform the delete mutation
      await client.graphql({
        query: mutation.deleteTheStaff, // Replace with your actual mutation
        variables: { input: { id: selectedId } },
      });
      setIsOpen(false);

      listStaff();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    listStaff();
  }, []);
  const listStaff = async () => {
    const client = generateClient();
    try {
      // Fetch staff list
      const staffdata = await client.graphql({
        query: listTheStaffs,
        variables: {},
      });
  
      const staffList = staffdata.data.listTheStaffs.items;
      console.log('Fetched Staff List:', staffList);
  
      // Sort the staff list by created date
      const sortedTasks = staffList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
              console.error(`Error fetching admin name for ${staff.userId}:`, error);
            }
          }
  
          // Return the staff object with adminName added
          return { ...staff, adminName };
        })
      );
  
      setStaffList(staffWithAdminNames); // Set the processed staff data in state
      console.log('Updated Staff List:', staffWithAdminNames);
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };
  

  const filteredStaffs = stafflist.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDialogue = (id) => {
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
      <div className="overflow-x-auto mt-10">
        {stafflist.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gradient-to-r from-[#4c4b4b] to-[#454545]">
              <tr>
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
                <th className="px-6 py-3 border-b text-white text-sm uppercase font-bold">
                Created By (Admin/Staff)
              </th>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.phoneNumber}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.email}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {order.profileStatus === 'Incomplete'
                      ? 'Pending'
                      : order.profileStatus}
                  </td>
                  <td className="px-6 py-4 border-b">
  {order.adminName ?? 'Admin'}
</td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex-row">
                    <div className="flex flex-row">
                      <Eye
                        onClick={() => {
                          navigation(`/Profile/${order.id}`);
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
        ) : (
          <div className="text-center py-10 text-gray-500">No data found</div>
        )}
      </div>
    </>
  );
};
export default ClientList;
