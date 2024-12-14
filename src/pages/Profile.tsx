import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { getTheStaff, listTheStaffs } from '../graphql/queries';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import UserOne from '../images/user.png';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams(); // Get the staff ID from the URL, if it exists
  const API = generateClient();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const breadcrumbTrail = location.state?.breadcrumb || [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    dob: '',
    employeeId: '',
  });
  console.log('sssqa', formData.status);

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
            status: staff.profileStatus,
            dob: staff.DOB,
            employeeId: staff.employeeId,
          });
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };

      fetchStaffData();
    }
  }, [id]);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [prevFileUri, setPrevFileUri] = useState<string | null>(null);

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
  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="mt-4 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex">
          <div className="p-10">
            <img
              src={fileUri || UserOne} // Use placeholder if fileUri is not available
              alt="profile"
              width={130}
              style={{
                width: 130,
                height: 130,
                borderRadius: 65, // Circular image
                objectFit: 'cover', // Ensure the image covers the entire area
              }}
            />
            <h3 className="mb-1.5 text-2xl mt-3 font-semibold text-black dark:text-white">
              {formData.name}
            </h3>
          </div>
          <div className="pt-10">
            <div className="flex p-3">
              <h4 className="font-semibold text-black dark:text-white">
                Employee Id
              </h4>
              <span className="text-sm ml-4">{formData.employeeId}</span>
            </div>
            <div className="flex p-3 ">
              <h4 className="font-semibold text-black dark:text-white">
                Email
              </h4>
              <span className="text-sm ml-3">{formData.email}</span>
            </div>
            <div className="flex p-3">
              <h4 className="font-semibold text-black dark:text-white">
                Phone Number
              </h4>
              <span className="text-sm ml-4">{formData.phoneNumber}</span>
            </div>

            <div className="flex p-3">
              <h4 className="font-semibold text-black dark:text-white">DOB</h4>
              <span className="text-sm ml-4">{formData.dob}</span>
            </div>

            <div className="flex p-3">
              <h4 className="font-semibold text-black dark:text-white">
                Profile Status
              </h4>
              <span
                className={`text-sm ml-4 px-2 py-1 border rounded ${
                  formData.status === 'Incomplete'
                    ? 'text-yellow-600 border-yellow-600'
                    : formData.status === 'Pending'
                      ? 'text-orange-600 border-yellow-600'
                      : formData.status === 'Completed'
                        ? 'text-green-600 border-green-600'
                        : 'text-gray-600 border-gray-300'
                }`}
              >
                {formData.status === 'Incomplete'
                  ? 'Pending'
                  : formData.status === 'Pending'
                    ? 'Pending'
                    : formData.status === 'Completed'
                      ? 'Completed'
                      : formData.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
