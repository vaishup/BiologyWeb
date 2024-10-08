import { Pencil, PencilIcon, Trash2 } from "lucide-react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { generateClient } from "aws-amplify/api";
import React, { useState, useEffect, useRef } from "react";
import * as mutation from "../graphql/mutations.js";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs"; // Import Day.js
import { useParams, useNavigate } from "react-router-dom"; // Import hooks from react-router-dom
import utc from 'dayjs/plugin/utc';

import { listTheStaffs, getTheShifts } from "../graphql/queries";
const AddTask = () => {
  dayjs.extend(utc);
  const currentDateTime = new Date();
  console.log(currentDateTime);
  const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log(formattedDate);

  const [stafflist, setStaffList] = useState([]);
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    duties: "",
    dateTime: "",
    staffid: "",
  });

  const { RangePicker } = TimePicker; // Use TimePicker.RangePicker for time range
  const API = generateClient();
  const { id, tag } = useParams();
  const [date, setDate] = useState(""); // State to store the selected date
  const [startTime, setStartTime] = useState(""); // State to store the selected date
  const [endTime, setEndTime] = useState(""); // State to store the selected date
  const [timeRange, setTimeRange] = useState(null); // State to store the selected time range
  const [selectedDate, setSelectedDate] = useState(""); // State to store the selected date
  const [selectedDay, setSelectedDay] = useState(""); // State to store the selected day of the week
  const [errors, setErrors] = useState({});
  const [ids, setId] = useState();
  const updateDateTime = (date, times) => {
    if (date && times && times.length === 2) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD"); // Format the selected date
      const startTime = dayjs(times[0]).format("HH:mm"); // Format start time
      const endTime = dayjs(times[1]).format("HH:mm"); // Format end time

      setDate(formattedDate);
      setEndTime(endTime);
      setStartTime(startTime);
      console.log("startTime",startTime);
      console.log("endTime",endTime);
      
      // Combine the date and time range into a single string
      const combinedDateTime = `${formattedDate} ${startTime} - ${endTime}`;
      console.log("combinedDateTime",combinedDateTime);
      
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
          console.log("Fetching staff with ID:", id); // Debug log
          const staffData = await API.graphql({
            query: getTheShifts, // Replace with your actual query to get staff by ID
            variables: { id },
          });
          const staff = staffData.data.getTheShifts;
          console.log("staff...s", staff.staffId);
          setFormData({
            location: staff.Location,
            duties: staff.duties,
            dateTime: staff.dateTime,
            staffid: staff.staffId,
          });
        } catch (error) {
          console.error("Error fetching staff data:", error);
        }
      };
      fetchStaffData();
    }
  }, [id]);
  const validate = () => {
    const errors = {};
    if (!formData.location) errors.location = "Location is required";
    if (!formData.duties) errors.duties = "Duties is required";
    if (!formData.dateTime) errors.dateTime = "Date Time is required";
    return errors;
  };
  const [selectedTimes, setSelectedTimes] = useState([]); // Store start and end times

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Perform validation
    const validationErrors = validate(); // Assume validate() is a function that returns an object of errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the errors in state to display in the UI
      return; // Stop the form submission if validation fails
    }
    try {
      // You can also add the times to the date for comparison or use in AWSDate if required.
      // const startDateTime = dayjs(`${selectedDate} ${startTime}`).format(
      //   "YYYY-MM-DDTHH:mm:ss"
      // ); // AWS format for startTime
      // const endDateTime = dayjs(`${selectedDate} ${selectedDate}`).format(
      //   "YYYY-MM-DDTHH:mm:ss"
      // ); // AWS format for endTime
      const formattedDate = dayjs(formData.date).format("YYYY-MM-DD"); // Date in "YYYY-MM-DD" format
      // const startDateTime = dayjs(`${selectedDate} ${startTime}`).toISOString(); // Start time in AWSDateTime format
      // const endDateTime = dayjs(`${selectedDate} ${endTime}`).toISOString();   // End time in AWSDateTime format
  
      const startDateTime = dayjs(`${formattedDate} ${startTime}`).toISOString(); // e.g., 2024-10-06T03:00:00Z
      const endDateTime = dayjs(`${formattedDate} ${endTime}`).toISOString();     // e.g., 2024-10-06T09:00:00Z
         

      const startDateTime1 = dayjs(`${formattedDate} ${startTime}`).format('YYYY-MM-DDTHH:mm:ss'); // Local time
const endDateTime1 = dayjs(`${formattedDate} ${endTime}`).format('YYYY-MM-DDTHH:mm:ss');   // Local time
console.log(startDateTime1);
console.log(endDateTime1);
console.log(startDateTime);
console.log(endDateTime);

//n ISO format for GraphQL

      // Step 2: Create the input object for staff creation or update
      const staffInput = {
        Location: formData.location,
        duties: formData.duties,
        staffId: formData.staffid,
        time: formData.dateTime, // This now contains the selected date and time range
        startDate: startDateTime1, // Add formatted start date
        endDate: endDateTime1, // Same date for start and end (assuming same-day shift)
        startTime: startDateTime, // Add formatted start time in AWS DateTime format
        endTime: endDateTime,
        // Add other fields as needed
      };
      console.log("Staff Input:", staffInput);

      let staffResponse;
      if (tag == "edit") {
        console.log("staffInput...", staffInput);

      // Update existing staff member
        staffResponse = await API.graphql({
          query: mutation.updateTheShifts,
          variables: { input: { id, ...staffInput } },
        });
      } else {
      // Create a new staff member
        staffResponse = await API.graphql({
          query: mutation.createTheShifts,
          variables: { input: staffInput },
        });
      }

      // Debug the API response
      console.log("Staff Response:", staffResponse);

      // Step 3: Handle the response and navigation
      const createdItem =
        staffResponse.data.createTheShifts ||
        staffResponse.data.updateTheShifts;
      if (!createdItem || !createdItem.id) {
        throw new Error("No ID returned from the GraphQL response.");
      }

      console.log(createdItem.id, "successfully created/updated");
      setId(createdItem.id); // Set the ID if it's a new creation
      // Step 4: Show success message and optionally navigate
 navigation("/taskList"); // Uncomment this if you want to navigate to the staff list page after submission
    } catch (error) {
      console.error("Error creating or updating staff:", error);
      // Handle the error (display message, etc.)
    }
  };

  // Handle date change and get the day of the week

  // Handle date change
  const handleDateChange = (date, dateString) => {
    console.log(date);
    console.log(dateString);

    console.log(date, dateString);
    setSelectedDate(dateString); // Store selected date
    updateDateTime(date, selectedTimes); // Call the function to update formData.dateTime

    if (date) {
      const dayOfWeek = dayjs(date).format("dddd"); // Get the day of the week (e.g., Monday)
      setSelectedDay(dayOfWeek); // Store the day in state
    } else {
      setSelectedDay(""); // Reset if no date is selected
      setSelectedDate(""); // Reset the date as well
    }
  };
  // Handle time range change
  const handleTimeRangeChange = (times) => {
    console.log("times", times);
    setSelectedTimes(times);
    updateDateTime(selectedDate, times); // Call the function to update formData.dateTime
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
      });
      const staffList = staffdata.data.listTheStaffs.items;
      const sortedTasks = staffList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setStaffList(sortedTasks);
      console.log("staffList---", staffList);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Add Shift" />

      <div className="flex justify-center items-center  bg-gray-100">
        <div className=" bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
          <h3 className=" font-medium text-black dark:text-white ">
            Shift's Details
          </h3>
          <div className="border-b mt-3  mb-6"></div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Location
              </label>
              <input
                type="text"
                name="location" // Add this line
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter Title"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Duties
              </label>
              <textarea
                rows={3}
                name="duties"
                value={formData.duties}
                onChange={handleChange}
                placeholder="Enter Description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            {/* <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="Enter Time"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div> */}
            <div className="flex flex-row ">
              <div className="mb-6 mr-10">
                <label className="w-50% mb-2.5 block text-black dark:text-white">
                  Date
                </label>
                <DatePicker
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={handleDateChange} // Handle date selection
                  // Display the formatted date and day
                />
              </div>

              <div className="mb-6 w-50%">
                <label className="mb-2.5 block text-black dark:text-white">
                  From - To Time
                </label>
                <RangePicker
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={handleTimeRangeChange} // Handle time range selection
                  placeholder={["Start Time", "End Time"]}
                  format="HH:mm" // Time format
                />
              </div>
            </div>
            <div className="w-full xl:w-1/2 mb-3">
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
            </div>

            <button className="btn-grad w-full py-3" onClick={() => {}}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddTask;
