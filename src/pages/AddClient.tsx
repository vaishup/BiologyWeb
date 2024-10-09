import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { ArrowUpFromLine } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { Modal } from 'antd';
import { Check } from 'lucide-react';
import * as mutation from '../graphql/mutations.js';
import { getTheStaff, listTheStaffs } from '../graphql/queries';

const AddClient = () => {
  const [name, setName] = useState();
  const navigation = useNavigate();
  const API = generateClient();
  const { id } = useParams(); // Get the staff ID from the URL, if it exists
  console.log('ids', id);
  // State to manage form validation errors
  const [errors, setErrors] = useState({});
  const [ids, setId] = useState();
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
   
    email: '',
    phoneNumber: '',
    status:''

  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    return errors;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Perform validation
    const validationErrors = validate(); // Assume validate() is a function that returns an object of errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the errors in state to display in the UI
      return; // Stop the form submission if validation fails
    }
    try {
      // Step 2: Create the input object for staff creation or update
      const staffInput = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        profileStatus: id ? formData.status : "Incomplete", // Set 'Incomplete' if creating new staff
        // Add other fields as needed
      };
      let staffResponse;
      if (id) {
        // Update existing staff member
        staffResponse = await API.graphql({
          query: mutation.updateTheStaff,
          variables: { input: { id, ...staffInput } },
        });
      } else {
        // Create a new staff member
        staffResponse = await API.graphql({
          query: mutation.createTheStaff,
          variables: { input: staffInput },
        });
      }
      // Step 3: Handle the response and navigation
      const createdItem = staffResponse.data.createTheStaff || staffResponse.data.updateTheStaff;
      console.log(createdItem.id, 'successfully created/updated');
      setId(createdItem.id); // Set the ID if it's a new creation
      // Step 4: Show success message and optionally navigate
      setIsOpen(true);
      navigation("/clientlist"); // Uncomment this if you want to navigate to the staff list page after submission
    } catch (error) {
      console.error('Error creating or updating staff:', error);
      // Handle the error (display message, etc.)
    }
  };
  useEffect(() => {
    if (id) {
      const fetchStaffData = async () => {
        try {
          console.log('Fetching staff with ID:', id); // Debug log
          const staffData = await API.graphql({
            query: getTheStaff, // Replace with your actual query to get staff by ID
            variables: { id },
          });

          const staff = staffData.data.getTheStaff;
          console.log('staff...s', staff);

          setFormData({
            name: staff.name,
            email: staff.email,
            phoneNumber: staff.phoneNumber,
            status:staff.profileStatus
          });
          
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };

      fetchStaffData();
    }
  }, [id]);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setIsShow] = useState(false);
  const handleDialogue = () => {
    setIsShow(true);
    setIsOpen(false);
  };
  const handleCancle = () => {
    setIsOpen(false);
    navigation('/stafflist');
  };
  return (
    <>
      <Breadcrumb pageName="Add Staff" />
      <Modal
        open={isOpen}
        onCancel={handleCancle}
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
            onClick={handleDialogue}
          >
            OK
          </button>,

          ,
        ]}
      >
        <div className="flex flex-col items-center justify-center p-5">
          {/* Success Icon */}
          <div className="mb-4 p-4 rounded-full bg-green-100 text-green-500">
            {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2l4 -4m0 0l2 2l-6 6l-2 -2l-4 -4"
        />
      </svg> */}
            <Check color="green" size={40} />
          </div>

          {/* Modal Content */}
          <p className="text-xl font-semibold text-center mb-2">
            Staff added Successfully
          </p>
         
        </div>
      </Modal>
      <div className="flex mt-10  w-[full] justify-center items-center">
        <div className="justify-center items-center flex ">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Staff's information
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
                            {" "}
              {/* Increase form width to full width */}
              <div className="w-[430px] justify-center items-center p-5">
                {" "}
                {/* Increase this container's width */}
                {/* Name Field */}
                <div className="w-full">
  <label className="mb-2.5 block text-black dark:text-white">
    Name <span className="text-meta-1">*</span>
  </label>
  <input
    name="name"  // Add this line
    value={formData.name}
    onChange={handleChange}
    type="text"
    placeholder="Enter your first Name"
    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  />
</div>

                {/* Email Field */}
                <div className="w-full">
                  <label className="mb-2.5  mt-2 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                      name="email"  // Add this line

                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {/* Phone Number Field */}
                <div className="w-full">
                  <label className="mb-2.5 mt-2 block text-black dark:text-white">
                    Phone Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                      name="phoneNumber"  // Add this line

                     value={formData.phoneNumber}
                     onChange={handleChange}
                    type="text"
                    placeholder="Enter your Phone Number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                { id && (
  <div className="w-full">
    <label className="mb-2.5 mt-3 block text-black dark:text-white">
      Profile Status
    </label>
    <select
      name="residentType" // Ensure this matches the formData key
      value={formData.status} // Bind the value to formData.status
      onChange={handleChange} // Handle change to update formData
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${errors.frequency ? 'border-red-500' : ''} dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
    >
      <option value="">Select Profile Status</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>
  </div>
)}

                {/* Submit Button */}
                <button className="w-full mt-10 btn-grad pr-20">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddClient;
