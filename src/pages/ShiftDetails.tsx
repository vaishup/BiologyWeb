import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { Modal } from 'antd';
import {
  getTheStaff,
  getLocation,
  listTheStaffs,
  getMainShift,
  getTheShifts,
  listTheShifts,
  deleteTheShifts,
} from '../graphql/queries';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import UserOne from '../images/user.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { PencilIcon } from 'lucide-react';
import dayjs from 'dayjs'; // Import dayjs if not already imported
import * as mutation from '../graphql/mutations.js';

const ShiftDetails = () => {
  const { id } = useParams();
  const { staffIds } = useParams();
  const staffIdsArray = staffIds.split(','); // Convert the string back to an array
  const [shiftList, setShiftList] = useState([]); // Array to store all staff details
  const [mainShift, setMainShift] = useState(null); // State to store shift data
  const [location, setLocation] = useState<string>(''); // State to hold location value
  const API = generateClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [amendment, setAmendment] = useState('');
  const [amendmenidt, setAmendmentID] = useState('');

  useEffect(() => {
    if (id) {
      listShifts(id);
    }
  }, [id]);

    const listShifts = async (id: any) => {
      console.log('MainShift ID:', id);
      try {
        // Fetch the MainShift data using the ID
        const shiftData = await API.graphql({
          query: getMainShift,
          variables: { id: id },
        });
        const datatMainShift = shiftData.data.getMainShift;
        setMainShift(datatMainShift);
        // Fetch the shifts data using the MainShift ID
        const shiftData1 = await API.graphql({
          query: listTheShifts,
          variables: {
            filter: {
              mainShiftID: { eq: id }, // Filter shifts by mainShiftID
            },
          },
        });
        const shiftList = shiftData1.data.listTheShifts.items; // Ensure it's an array
        console.log('shiftList---', shiftList); // Verify the structure
        // Proceed to map over shiftList
        const allShiftWithStaff = await Promise.all(
          shiftList.map(async (shift) => {
            // For each shift, fetch the staff details using the staffId
            const staffDetails = await fetchStaffData(shift.staffId);
            console.log('staffDetails', staffDetails);
          
            await downloadFromS3({
              folder: 'userprofile',
              subFolder: 'selfie',
              setFileUrl: (url) => {
                setFileUri(url);
                setPrevFileUri(url);
                console.log('url', url);
              },
              id: shift.staffId, // Map `shift.staffId` to `id`
            });
        

            return { ...shift, staffDetails }; // Combine the shift data with staff details
          }),
        );
        setShiftList(allShiftWithStaff);

        try {
          const locationData = await API.graphql({
            query: getLocation,
            variables: { id: datatMainShift.locationID },
          });
          setLocation(locationData.data.getLocation.name); // Set location using state
        } catch (error) {
          console.error(
            `Error fetching location for ID: ${datatMainShift.locationID}`,
            error,
          );
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    const fetchStaffData = async (ids) => {
      try {
        let allStaffData;
        if (Array.isArray(ids)) {
          allStaffData = await Promise.all(
            ids.map(async (id) => {
              const staffData = await API.graphql({
                query: getTheStaff,
                variables: { id: id },
              });
              const staffDetails = staffData.data.getTheStaff;
    const ids =staffDetails.id.toString()
              // Fetch the file from S3 for this staffId
              // await downloadFromS3({
              //   folder: 'userprofile',
              //   subFolder: 'selfie',
              //   setFileUrl: (url) => {
              //     setFileUri(url);
              //     setPrevFileUri(url);
              //     console.log('url', url);
              //   },
              //   ids
              // });
    
              return staffDetails;
            }),
          );
        } else {
          const staffData = await API.graphql({
            query: getTheStaff,
            variables: { id: ids },
          });
          const staffDetails = staffData.data.getTheStaff;
    
          // Fetch the file from S3 for this staffId
          // await downloadFromS3({
          //   folder: 'userprofile',
          //   subFolder: 'selfie',
          //   setFileUrl: (url) => {
          //     setFileUri(url);
          //     setPrevFileUri(url);
          //     console.log('url', url);
          //   },
          //   id:ids
          // });
    
          allStaffData = staffDetails;
        }
        return allStaffData; // Return the fetched staff data (single or array)
      } catch (error) {
        console.error('Error fetching staff data:', error);
        return []; // Return an empty array in case of error
      }
    };
    
    

  const [fileUri, setFileUri] = useState<string | null>(null);
  const [prevFileUri, setPrevFileUri] = useState<string | null>(null);

  const downloadFromS3 = async ({
    folder,
    subFolder,
    fullPath,
    setFileUrl,
    id
  }: {
    folder?: string;
    subFolder?: string;
    fullPath?: string;
    setFileUrl: (url: string) => void;
    id:string
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
      setIsLoading(false);
    };
    downloadFile();
  }, []);

  const delet = async (selectedId) => {
    try {
      await API.graphql({
        query: mutation.deleteTheShifts,
        variables: { input: { id: selectedId } },
        apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji',
      });
      // setIsOpen(false);
      listShifts(id); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const handleAmedn = async (id: any) => {
    console.log('id', id);

    setIsOpen(true);

    setAmendmentID(id);
  };
  const handleAddAmendment = async (e) => {
    e.preventDefault();

    try {
      // Define the input fields required by your GraphQL mutation
      const updateInput = {
        id: amendmenidt, // Replace with the actual shift ID to update
        amendment: amendment, // New amendment value
      };

      // Call the API
      const response = await API.graphql({
        query: mutation.updateTheShifts, // Replace with your actual GraphQL mutation
        variables: { input: updateInput },
        apiKey: 'da2-mttg3c4kpjgi3jgfvaelnjquji', // Ensure this API key is correct
      });

      const updatedShift = response.data.updateTheShifts;

      console.log('Shift updated:', updatedShift);
      setAmendment(''); // Reset the amendment field
      setIsOpen(false); // Close modal
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };
  const navigation = useNavigate();

  return (
    <>
      <Breadcrumb pageName="Shift Details" />
      <div className="justify-start items-start mt-10">
        <div className="relative mb-2 px-3 py-3 bg-white rounded-lg border border-[#d9d9d9] max-w-4xl">
          {/* Edit button inside the box */}
          <div
            onClick={() => {
              navigation(`/addTask/edit/${id}?from=ShiftDetails`);
            }}
            className="absolute top-3 right-3 flex flex-row rounded-xl border border-[#00aaff] p-2 cursor-pointer"
          >
            <span className="text-md font-medium text-[#00aaff] mr-1">
              Edit
            </span>
            <PencilIcon color="#00aaff" className="mt-1 " size={17} />
          </div>

          {/* Shift Information */}
          <h2 className="text-lg font-semibold text-black mb-4 text-left">
            Shift Information
          </h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="flex flex-row text-left">
              <p className="text-md text-black">Location:</p>
              <p className="text-base text-gray-900 font-medium pl-3">
                {location}
              </p>
            </div>
            <div className="flex flex-row text-left">
              <p className="text-md text-black">Duties:</p>
              <p className="text-base text-gray-900 font-medium pl-3">
                {mainShift?.duties}
              </p>
            </div>
            <div className="flex flex-row text-left">
              <p className="text-md text-black">Start Time:</p>
              <p className="text-base text-gray-900 font-medium pl-3">
                {mainShift?.startDate
                  ? dayjs(mainShift.startDate).format('YYYY-MM-DD hh:mm A') // Format Start Time
                  : 'Not Available'}
              </p>
            </div>
            <div className="flex flex-row text-left">
              <p className="text-md text-black">End Time:</p>
              <p className="text-base text-gray-900 font-medium pl-3">
                {mainShift?.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
        <label className="block text-black dark:text-white">
          Add Amendment
        </label>
        <input
          type="text"
          name="amendment"
          value={amendment}
          onChange={(e) => setAmendment(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          placeholder="Enter Amendment"
        />
        <button
          onClick={handleAddAmendment}
          type="submit"
          className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md shadow-md"
        >
          Save
        </button>
      </Modal>
      <div className="mt-4">
        {shiftList.map((staff, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-[#d9d9d9] bg-white mb-4"
          >
            <div className="flex">
              {/* Profile Section */}
              <div className="p-5">
                <img
                  src={fileUri || UserOne} // Use placeholder if fileUri is not available
                  alt="profile"
                  width={130}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    objectFit: 'cover',
                  }}
                />
                <h3 className="mb-1.5 text-2xl mt-3 font-semibold text-black">
                  {staff.staffDetails.name}
                </h3>
              </div>

              {/* Details Section */}
              <div className="justify-center items-center mt-5">
                {/* Employee ID */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">Employee Id</h4>
                  <span className="text-sm ml-4">
                    {staff.staffDetails.employeeId}
                  </span>
                </div>

                {/* Phone Number */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">Phone Number</h4>
                  <span className="text-sm ml-4">
                    {staff.staffDetails.phoneNumber}
                  </span>
                </div>

                {/* DOB */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">DOB</h4>
                  <span className="text-sm ml-4">{staff.staffDetails.DOB}</span>
                </div>

                {/* Profile Status */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">Profile Status</h4>
                  <span
                    className={`text-sm ml-4 px-2 py-1 border rounded ${
                      staff.profileStatus === 'Incomplete'
                        ? 'text-yellow-600 border-yellow-600'
                        : staff.profileStatus === 'Pending'
                          ? 'text-orange-600 border-orange-600'
                          : staff.profileStatus === 'Completed'
                            ? 'text-green-600 border-green-600'
                            : 'text-gray-600 border-gray-300'
                    }`}
                  >
                    {staff.staffDetails.profileStatus}
                  </span>
                </div>
              </div>

              <div className="justify-center items-center mt-5 ml-10">
                {/* Start Time */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">Start Time</h4>
                  <span className="text-sm ml-4">
                    {staff.startTime || 'Not Set'}
                  </span>
                </div>

                {/* End Time */}
                <div className="flex p-3">
                  <h4 className="font-semibold text-black">End Time</h4>
                  <span className="text-sm ml-4">
                    {staff.endTime || 'Not Set'}
                  </span>
                </div>

                {/* Unassign */}
                <div className="flex flex-row p-3">
                  <button
                    className="text-sm ml-4 text-red-600 border border-red-600 rounded px-2 py-1"
                    onClick={() => delet(staff.id)}
                  >
                    Unassign
                  </button>
                  <button
                    className="text-sm ml-4 bg-gradient-to-r from-[#4fa3f7] to-[#00aaff] text-white border border-transparent rounded-lg px-1  py-1 hover:bg-gradient-to-r hover:from-[#0099cc] hover:to-[#0077b3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => handleAmedn(staff.id)}
                  >
                    Add Amendment
                  </button>
                </div>

                {/* Amendment */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShiftDetails;
