import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import hooks from react-router-dom
import { generateClient } from 'aws-amplify/api';
import { getTheViewIDUser, listTheStaffs } from '../graphql/queries';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import UserOne from '../images/user.png';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewIdDetails = () => {
  const { id } = useParams(); // Get the staff ID from the URL, if it exists
  const client = generateClient({
    authMode: 'userPool', // Use Cognito User Pools authentication
  });  
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const breadcrumbTrail = location.state?.breadcrumb || [];

  const [formData, setFormData] = useState({
    name: '',
    scanNumber: '',
    employeeId: '',
  });
  //console.log('sssqa', formData.status);

  useEffect(() => {
    if (id) {
      const fetchStaffData = async () => {
        try {
          console.log('Fetching staff with ID:', id); // Debug log
          const staffData = await client.graphql({
            query: getTheViewIDUser, // Replace with your actual query to get staff by ID
            variables: { id },
          });

          const staff = staffData.data.getTheViewIDUser;
          console.log('staff...s', staff);

          setFormData({
            name: staff.name,
            scanNumber: staff.scanNumber,

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
  const navigation = useNavigate();

  return (
    <>
      <Breadcrumb pageName="View ID" />
      <div className="mt-4 w-[550px] overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark relative">
        {/* Edit button in the top-right */}
        <button className="mb-10 absolute top-4 right-4 flex items-center gap-2 rounded-sm px-4 py-1.5 text-sm hover:bg-gray dark:hover:bg-meta-4" 
        onClick={() => {
            navigation(`/EditViewId/${id}`);
          }}>
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_62_9787)">
              <path
                d="M15.55 2.97499C15.55 2.77499 15.475 2.57499 15.325 2.42499C15.025 2.12499 14.725 1.82499 14.45 1.52499C14.175 1.24999 13.925 0.974987 13.65 0.724987C13.525 0.574987 13.375 0.474986 13.175 0.449986C12.95 0.424986 12.75 0.474986 12.575 0.624987L10.875 2.32499H2.02495C1.17495 2.32499 0.449951 3.02499 0.449951 3.89999V14C0.449951 14.85 1.14995 15.575 2.02495 15.575H12.15C13 15.575 13.725 14.875 13.725 14V5.12499L15.35 3.49999C15.475 3.34999 15.55 3.17499 15.55 2.97499ZM8.19995 8.99999C8.17495 9.02499 8.17495 9.02499 8.14995 9.02499L6.34995 9.62499L6.94995 7.82499C6.94995 7.79999 6.97495 7.79999 6.97495 7.77499L11.475 3.27499L12.725 4.49999L8.19995 8.99999ZM12.575 14C12.575 14.25 12.375 14.45 12.125 14.45H2.02495C1.77495 14.45 1.57495 14.25 1.57495 14V3.87499C1.57495 3.62499 1.77495 3.42499 2.02495 3.42499H9.72495L6.17495 6.99999C6.04995 7.12499 5.92495 7.29999 5.87495 7.49999L4.94995 10.3C4.87495 10.5 4.92495 10.675 5.02495 10.85C5.09995 10.95 5.24995 11.1 5.52495 11.1H5.62495L8.49995 10.15C8.67495 10.1 8.84995 9.97499 8.97495 9.84999L12.575 6.24999V14ZM13.5 3.72499L12.25 2.49999L13.025 1.72499C13.225 1.92499 14.05 2.74999 14.25 2.97499L13.5 3.72499Z"
                fill=""
              />
            </g>
            <defs>
              <clipPath id="clip0_62_9787">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Edit
        </button>

        <div className="flex ">
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

            <div className="flex p-3">
              <h4 className="font-semibold text-black dark:text-white">
                Scan Number
              </h4>
              <span className="text-sm ml-4">{formData.scanNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewIdDetails;
