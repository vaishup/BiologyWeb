import DefaultLayout from '../layout/DefaultLayout';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user.png';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ArrowUpFromLine } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { Modal } from 'antd';
import { Check } from 'lucide-react';
import * as mutation from '../graphql/mutations.js';
import { getTheStaff, listTheStaffs } from '../graphql/queries';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';

const Profile = () => {
  const { id } = useParams(); // Get the staff ID from the URL, if it exists
  const API = generateClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    dob: '',
  });
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
              src={fileUri}
              alt="profile"
              width={130}
              style={{
                width: 130,
                height: 130,
                borderRadius: 65, // Half of the width and height to make it a circle
              }}
            />
            <h3 className="mb-1.5 text-2xl mt-3 font-semibold text-black dark:text-white">
              {formData.name}
            </h3>
          </div>
          <div className="pt-10">
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
              <span className="text-sm ml-4">{formData.status}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
