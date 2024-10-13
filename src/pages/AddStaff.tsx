import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { Modal } from 'antd';
import { Check } from 'lucide-react';
const AddStaff = () => {

  const navigation = useNavigate();
  const API = generateClient();
  const { id } = useParams(); // Get the staff ID from the URL, if it exists

  // State to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    userName: '',
    staffType: '',
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
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.staffType) errors.staffType = 'Please Select Staff Type';
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
        fname: formData.firstName,
        phoneno: formData.phoneNumber,
        lname: formData.lastName,
        email: formData.email,
        joiningdate: formData.joiningDate,
        staffType:formData.staffType
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
      // navigation("/staffList"); // Uncomment this if you want to navigate to the staff list page after submission
    } catch (error) {
      console.error('Error creating or updating staff:', error);
      // Handle the error (display message, etc.)
    }
  };
  
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
        <Breadcrumb pageName="Add Employee" />
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
          <p className="text-center text-gray-600">
            Would you like to add Client Profile to this Employee?
          </p>
        </div>
      </Modal>
        <div className="flex justify-center items-center  bg-gray-100">
  <div className="bg-white p-6  rounded-lg shadow-lg w-full max-w-xl">
  <h3 className="font-medium text-black dark:text-white  border-b border-stroke dark:border-gray-700 pb-2">
      Staff's Details
    </h3>    <form action="#" className="w-full">
                <div className="p-6.5 ">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        First name<span className="text-meta-1">*</span>
                      </label>
                      <input
                      
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Last name<span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5  w-full flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Email <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Phone Number <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your phone Number"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Joining date
                      </label>
                      <input
                        type="text"
                        placeholder="Enter JoiningDate"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        UserName
                      </label>
                      <input
                        type="text"
                        placeholder="Enter UserName"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <button className="btn-grad w-full py-3" onClick={() => {}}>
        Submit
      </button> 
                </div>
              </form>
            </div>
          </div>
   
    </>
  );
};
export default AddStaff;
