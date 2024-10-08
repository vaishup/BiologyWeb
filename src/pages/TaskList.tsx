import { PencilIcon, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import dayjs from 'dayjs'; // Import dayjs if not already imported

import {
  listTheShifts,
  getTheStaff,
  deleteTheShifts
} from '../graphql/queries';
import * as mutation from '../graphql/mutations.js';

const TaskList = () => {
  const tasks = [
    {
      id: '001',
      title: 'Daily Backup',
      description:
        'Perform daily backup of all databases and critical systems.',
      frequency: 'Daily',
      createdDate: '2024-08-14',
    },
    {
      id: '002',
      title: 'Weekly Security Audit',
      description:
        'Conduct a weekly audit of all security protocols and update any necessary patches.',
      frequency: 'Weekly',
      createdDate: '2024-08-07',
    },
    {
      id: '003',
      title: 'Monthly Report Generation',
      description:
        'Generate and submit monthly performance and financial reports to the management team.',
      frequency: 'Monthly',
      createdDate: '2024-08-01',
    },
    {
      id: '004',
      title: 'Quarterly System Maintenance',
      description:
        'Carry out quarterly maintenance of all physical and virtual servers.',
      frequency: 'Quarterly',
      createdDate: '2024-07-15',
    },
    {
      id: '005',
      title: 'Annual Disaster Recovery Test',
      description:
        'Perform an annual test of the disaster recovery plan to ensure readiness in case of an emergency.',
      frequency: 'Annually',
      createdDate: '2024-01-10',
    },
  ];
  const client = generateClient();
  const [stafflist, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    listStaff();
  }, []);
  const listStaff = async () => {
    const client = generateClient();
    try {
      const staffdata = await client.graphql({
        query: listTheShifts,
        variables: {},
      });
      
      const shiftsList = staffdata.data.listTheShifts.items;
      console.log("shiftsList...", shiftsList);
      
      // Sort the tasks by createdAt date
      const sortedTasks = shiftsList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
  
      // Loop through each shift and fetch the staff name using staffId
      const shiftsWithStaffNames = await Promise.all(
        sortedTasks.map(async (shift) => {
          if (shift.staffId) {
            try {
              const staffData = await client.graphql({
                query: getTheStaff, // Replace with your actual query to get staff by ID
                variables: { id: shift.staffId }, // Fetch staff by staffId
              });
  
              // Add staff name to the shift object
              const staffName = staffData.data.getTheStaff.name;
              console.log("staffName...",staffName);
              
              return { ...shift, staffName }; // Append staff name to the shift object
            } catch (error) {
              console.error(`Error fetching staff name for staffId ${shift.staffId}:`, error);
              return { ...shift, staffName: "Unknown" }; // In case of error, default to "Unknown"
            }
          }
          return shift; // Return the shift object if no staffId is present
        })
      );
  
      // Update the state with the shifts that now include staff names
      setStaffList(shiftsWithStaffNames);
      console.log("Updated staff list with names:", shiftsWithStaffNames);
  
    } catch (error) {
      console.error("Error fetching shifts or staff details:", error);
    }
  };
  // const filteredStaffs = stafflist.filter(
  //   (client) =>
  //     client.name.toLowerCase().includes(searchQuery.toLowerCase()) 
   
  // );
  const handleDelete = async (id) => {
    try {
      // Confirm deletion with the user (optional)
      // const confirmed = window.confirm(
      //   'Are you sure you want to delete this item?',
      // );
      // if (!confirmed) return;

      // Perform the delete mutation
      await client.graphql({
        query: mutation.deleteTheShifts, // Replace with your actual mutation
        variables: { input: { id } },
      });

      listStaff();
      console.log(`Item with ID ${id} has been deleted`);

      // Optionally, you can update the state to remove the deleted item from the list
      // For example, if you have a state called `orders`:
      // setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const navigation = useNavigate();
  return (
    <>
        <div className="flex items-center justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Shift List
          </h2>

          <button
            className="btn-grad w-[180px] pr-20"
            onClick={() => {
              const addString = 'add';
              navigation(`/addTask/${addString}`);
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
            Add New Shift
          </button>
        </div>

        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gradient-to-r from-[#4c4b4b] to-[#454545]">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Location
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Duties 
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Staff Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  Shift Time
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-white text-left text-sm uppercase font-bold">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
  {stafflist.length === 0 ? (
    <tr>
      <td
        colSpan={5} // Adjust based on the number of columns in your table
        className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-center"
      >
        No Data Found
      </td>
    </tr>
  ) : (
    stafflist.map((order) => (
      <tr key={order.id}>
        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
          {order.Location}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
          {order.duties}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
          {order.staffName}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
  {dayjs(order.startTime).format('YYYY-MM-DD h:mm A')} - {dayjs(order.endTime).format('h:mm A')}
</td>
        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex-row">
          <div className="flex flex-row">
            <PencilIcon
              onClick={() => {
                navigation(`/addTask/edit/${order.id}`);
              }}
              className="mr-5 inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
              color="black"
              size={20}
            />
            <Trash2
              onClick={() => {
                handleDelete(order.id);
              }}
              className="inline-block transition duration-300 ease-in-out transform hover:text-red-600 hover:scale-110"
              color="black"
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
