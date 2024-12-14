import { Check, Pencil, PencilIcon, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { generateClient } from 'aws-amplify/api';
import React, { useState, useEffect, useRef } from 'react';
import * as mutation from '../graphql/mutations.js';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs'; // Import Day.js
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import utc from 'dayjs/plugin/utc';
import { Modal } from 'antd';
import UpdateModal from '../components/modal/UpdateModal.js';
import {
  getTableID,
  getUserInfo,
  getCustomAttributes,
} from '../hooks/authServices.js';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TimePicker as Time } from '@mui/x-date-pickers/TimePicker';
import { listTheStaffs, getTheShifts } from '../graphql/queries';
const AddTask = () => {
  const [stafflist, setStaffList] = useState([]);
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    duties: '',
    dateTime: '',
    staffid: '',
    startDate: dayjs(),
    endDate: dayjs().add(1, 'hour'),
  });

  const { RangePicker } = TimePicker; // Use TimePicker.RangePicker for time range
  const API = generateClient();
  const { id, tag } = useParams();
  const [date, setDate] = useState(''); // State to store the selected date
  const [startTime, setStartTime] = useState(''); // State to store the selected date
  const [endTime, setEndTime] = useState(''); // State to store the selected date
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [ids, setId] = useState();
  const [status, setStatus] = useState();

  const updateDateTime = (date, times) => {
    if (date && times && times.length === 2) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format the selected date
      const startTime = dayjs(times[0]).format('HH:mm'); // Format start time
      const endTime = dayjs(times[1]).format('HH:mm'); // Format end time
      setDate(formattedDate);
      setEndTime(endTime);
      setStartTime(startTime);
      console.log('startTime', startTime);
      console.log('endTime', endTime);

      // Combine the date and time range into a single string
      const combinedDateTime = `${formattedDate} ${startTime} - ${endTime}`;
      console.log('combinedDateTime', combinedDateTime);

      setFormData({
        ...formData,
        dateTime: combinedDateTime, // Update formData.dateTime with the combined value
      });
    }
  };

  useEffect(() => {
    if (id) {
      const fetchStaffData = async () => {
        try {
          const staffData = await API.graphql({
            query: getTheShifts, // Replace with your actual query to get staff by ID
            variables: { id },
          });
          const staff = staffData.data.getTheShifts;
          console.log('staff.dateTime', staff.time);
          setStatus(staff.shiftstatus);

          const parsedStartDate = dayjs(staff.startDate); // Ensure this is a valid date format
          const parsedEndDate = dayjs(staff.endDate, 'hh:mm A'); // Parse time with specific format
          setSelectedDates(parsedStartDate); // Update with parsed dayjs object
          setEndTimes(parsedEndDate); // Update with parsed dayjs object
          setFormData({
            location: staff.Location,
            duties: staff.duties,
            dateTime: staff.dateTime,
            staffid: staff.staffId,
            startDate: staff.parsedStartDate,
            endDate: staff.parsedEndDate,
          });
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };
      fetchStaffData();
    }
  }, [id]);
  const formattedStartDate = dayjs(formData.startDate);
  const formattedEndDate = dayjs(formData.endDate);

  const validate = () => {
    const errors = {};

    if (!formData.location) errors.location = 'Location is required';
    if (!formData.duties) errors.duties = 'Duties is required';

    // Ensure startDate and endDate are valid dayjs objects
    const formattedStartDate = dayjs(formData.startDate);
    const formattedEndDate = dayjs(formData.endDate);

    // Check if startDate is in the past
    if (formattedStartDate.isBefore(dayjs())) {
      errors.startDate = 'Start date and time cannot be in the past';
    }

    // Check if endDate is before startDate
    // if (formattedEndDate.isBefore(formattedStartDate)) {
    //   errors.endDate = "End time must be after the start date and time";
    // }

    console.log(
      'formattedStartDate:',
      formattedStartDate.format('YYYY-MM-DD HH:mm'),
    );
    console.log(
      'formattedEndDate:',
      formattedEndDate.format('YYYY-MM-DD HH:mm'),
    );

    return errors;
  };

  const [selectedTimes, setSelectedTimes] = useState([]); // Store start and end times
  const [isOpen, setIsOpen] = useState(false);
  const [show, setIsShow] = useState(false);
  const [staffType, setStaffType] = useState('');

  const fetchUserData = async () => {
    try {
      const { tableID } = await getCustomAttributes();
      const userId = await getTableID();
      console.log('userDetail', userId);

      const userData = await getUserInfo(userId); // Fetch the user info
      setStaffType(userData.userType);
      console.log('serData.userType---', userData.userType);

      // setUser(userData); // Store the user data in state
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Store the error in state
    } finally {
      // setLoading(false); // Stop loading when operation is complete
    }
  };

  // useEffect to call the fetch function when the component mounts
  useEffect(() => {
    fetchUserData(); // Call the async function inside useEffect
  }, []); // Empty dependency array ensures it runs only once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Perform validation
    const validationErrors = validate(); // Assume validate() is a function that returns an object of errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the errors in state to display in the UI
      return; // Stop the form submission if validation fails
    }
    try {
      const formattedStartDates =
        formData.startDate.format('YYYY-MM-DD hh:mm A');

      const enddate = dayjs(formData.endDate).format('hh:mm A');
      const userId = await getTableID();
      console.log('userId', userId);

      // Step 2: Create the input object for staff creation or update
      const staffInput = {
        Location: formData.location,
        duties: formData.duties,
        staffId: formData.staffid,
        time: formData.dateTime, // This now contains the selected date and time range
        startDate: formattedStartDates, // Add formatted start date
        endDate: enddate, // Same date for start and end (assuming same-day shift)
        // startTime: startDateTime, // Add formatted start time in AWS DateTime format
        // endTime: startDateTime,
        shiftstatus: status ? status : 'Pending',
        userId: userId,
        //userId: staffType === 'staff' ? userId : userId, // Conditional assignment
        // Add other fields as needed
      };
      console.log('Staff Input:', staffInput);

      let staffResponse;
      if (tag == 'edit') {
        console.log('staffInput...', staffInput);

        // Update existing staff member
        staffResponse = await API.graphql({
          query: mutation.updateTheShifts,
          variables: { input: { id, ...staffInput } },
          apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji',
          //authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        console.log(staffInput);

        navigation('/ShiftList');
      } else {
        // Create a new staff member
        staffResponse = await API.graphql({
          query: mutation.createTheShifts,
          variables: { input: staffInput },
          apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji',
          //  authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setIsShow(true);
      }

      // Debug the API response
      console.log('Staff Response:', staffResponse);

      // Step 3: Handle the response and navigation
      const createdItem =
        staffResponse.data.createTheShifts ||
        staffResponse.data.updateTheShifts;
      if (!createdItem || !createdItem.id) {
        throw new Error('No ID returned from the GraphQL response.');
      }

      console.log(createdItem.id, 'successfully created/updated');
      setId(createdItem.id); // Set the ID if it's a new creation
      if (tag == 'edit') {
        navigation('/ShiftList');
      }
      // Step 4: Show success message and optionally navigate
      // Uncomment this if you want to navigate to the staff list page after submission
    } catch (error) {
      console.error('Error creating or updating staff:', error);
      // Handle the error (display message, etc.)
    }
  };

  // Handle date change and get the day of the week
  const [selectedDates, setSelectedDates] = useState(); // Start date and time
  const [endTimes, setEndTimes] = useState(); // End time

  const handleDateChanges = (newValue) => {
    setFormData((prev) => ({ ...prev, startDate: newValue }));
    setErrors((prev) => ({
      ...prev,
      startDate: '',
    })); // Clear specific error
  };

  const handleEndTimeChange = (newValue) => {
    setFormData((prev) => ({ ...prev, endDate: newValue }));
    setErrors((prev) => ({
      ...prev,
      endDate: '',
    })); // Clear specific error
  };

  useEffect(() => {
    listStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the formData field based on the input's name
    });
  };

  const listStaff = async () => {
    const client = generateClient();
    try {
      const staffdata = await client.graphql({
        query: listTheStaffs,
        variables: {},
        //authMode: 'AMAZON_COGNITO_USER_POOLS', // Use Cognito User Pools authentication
      });
      const staffList = staffdata.data.listTheStaffs.items;
      const sortedTasks = staffList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setStaffList(sortedTasks);
    } catch (error) {
      console.error('Error fetching driver details:', error);
    }
  };

  const handleDialogue = () => {
    setIsShow(true);
    setIsOpen(false);
  };
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocation.trim()) {
      alert('Location name cannot be empty.');
      return;
    }
    try {
      // Save the new location
      const locationInput = { name: newLocation, status: 'Active' };
      const response = await API.graphql({
        query: mutation.createLocation, // Replace with your actual GraphQL mutation
        variables: { input: locationInput },
        apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji', // Replace with your actual API key
      });
      const newLoc = response.data.createLocation;
      setLocations([...locations, newLoc]); // Add the new location to the dropdown
      setNewLocation(''); // Reset input field
      setIsLocationModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location.');
    }
  };
  const [locations, setLocations] = useState([]); // Store dynamic locations
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false); // Control modal visibility
  const [newLocation, setNewLocation] = useState(''); // New location input

  const handleCancle = () => {
    setIsOpen(false);
    navigation('/ShiftList');
  };

  return (
    <>
      <Breadcrumb pageName="Add Shift" />
      <Modal
        open={isOpen}
        onCancel={handleCancle}
        footer={[
          // <button
          //   className="text-black mr-5  h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
          //   key="back"
          //   onClick={() => setIsOpen(false)}
          // >
          //   Cancel
          // </button>,
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
            Shift Added Succesfully
          </p>
          <p className="text-center text-gray-600">
            Please add Employye to this Shift
          </p>
        </div>
      </Modal>

      <Modal open={show} onCancel={handleCancle} footer={[]}>
        <UpdateModal id={ids} setIsShow={setIsShow} onClose={listStaff} />
      </Modal>
      <div className="flex justify-center items-center  bg-gray-100">
        <div className=" bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
          <h3 className=" font-medium text-black dark:text-white ">
            Shift's Details
          </h3>
          <div className="border-b mt-3 mb-6"></div>
         
          <div className="w-full">
            <div className="w-full flex items-center justify-between   mb-2">
              <label className="text-black dark:text-white">Location</label>
              <button
                className="text-white bg-blue-500 h-8 hover:bg-blue-600 px-4 py-1 rounded-md shadow-md"
                onClick={() => setIsLocationModalOpen(true)} // Open modal to add new location
              >
                Add New
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Location Dropdown */}
              <select
                name="location" // Ensure this matches the formData key
                value={formData.location} // Bind the value to formData.location
                onChange={handleChange} // Handle change to update formData
                className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${
                  errors.location ? 'border-red-500' : ''
                } dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              >
                <option value="">Select Location</option>
                <option value="Airport">
                  Airport - 2710 Britannia Rd E, Mississauga, ON L4W 1S9
                </option>
                <option value="Office">
                  Office - 2552 Finch Ave. West. Unit 105. Toronto M9M 2G3
                </option>
                {/* Dynamically render added locations */}
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {/* "Add New Location" Button */}
            </div>
          </div>
          {isLocationModalOpen && (
            <Modal
              open={isLocationModalOpen}
              onCancel={() => setIsLocationModalOpen(false)}
              footer={null}
            >
              <form onSubmit={handleAddLocation}>
                <label className="block text-black dark:text-white">
                  New Location Name
                </label>
                <input
                  type="text"
                  name="newLocation"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter Location Name"
                />
                <button
                  type="submit"
                  className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md shadow-md"
                >
                  Save
                </button>
              </form>
            </Modal>
          )}
          <div className="mb-4 mt-5">
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <textarea
              rows={3}
              name="duties"
              value={formData.duties}
              onChange={handleChange}
              placeholder="Enter Description"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
            {errors.duties && (
              <p className="text-red-500 text-sm mt-1">{errors.duties}</p>
            )}
          </div>

          <label className="mb-2.5 block text-black dark:text-white">
            Select Start Date Time and End Time
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="w-full flex justify-between space-x-4">
              {/* Start Date and Time Picker */}
              <DateTimePicker
                value={selectedDates}
                label="Start Date and Time"
                onChange={handleDateChanges} // Event handler for date change
                minDateTime={dayjs()} // Disable past dates and times
              />

              {/* End Time Picker */}
              <Time
                value={endTimes}
                label="End Time"
                onChange={handleEndTimeChange} // Event handler for time change
              />
            </div>
            <div className="w-full flex justify-between space-x-4">
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </LocalizationProvider>
          
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {errors.selectedDate && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>
          )}
          {/* <div className="w-full xl:w-1/2 mb-3">
              <label className="mb-2.5 block text-black dark:text-white">
                Select Staff
              </label>
              <select
                name="staffid" // This should match the formData key
                value={formData.staffid} // Bind the selected value to formData
                onChange={handleChange} // Handle change to update formData
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Staff</option>
                {stafflist.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div> */}

          <button className="btn-grad w-full py-3 mt-4" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
export default AddTask;
