import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect ,useRef} from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutation from '../graphql/mutations.js';
import { listTheViewIDUsers,getTheViewIDUser } from '../graphql/queries.js';
import { Text } from '@aws-amplify/ui-react';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import UserOne from '../images/user.png';
import { PencilIcon } from 'lucide-react';

const EditViewId = () => {
  const client = generateClient({
    authMode: 'userPool', // Use Cognito User Pools authentication
  });
  const navigation = useNavigate();
  const { id } = useParams(); // Get the staff ID from the URL
  const [errors, setErrors] = useState({});
  const [barcodeError, setBarcodeError] = useState('');
  const [file, setFile] = useState(null); // State for file
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    barcode: '',
  });
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [prevFileUri, setPrevFileUri] = useState<string | null>(null);

  useEffect(() => {
    listStaff();
  }, []);
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
     // setIsLoading(false);
    };
    downloadFile();
  }, []);
  useEffect(() => {
    if (id) {
      const fetchStaffData = async () => {
        try {
          console.log('Fetching staff with ID:', id); // Debug log
          const staffData = await client.graphql({
            query: getTheViewIDUser, // Replace with your actual query to get staff by ID
            variables: { id },
            authMode: 'userPool', // Use Cognito User Pools authentication

          });

          const staff = staffData.data.getTheViewIDUser;
          console.log('staff...s', staff);

          setFormData({
            name: staff.name,
            barcode: staff.scanNumber,

            employeeId: staff.employeeId,
          });
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };

      fetchStaffData();
    }
  }, [id]);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [imageUrl, setImageUrl] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUri(selectedFile);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      console.log('Selected File:', selectedFile);
    }
  };

  const generateRandom10DigitNumber = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };
  const listStaff = async () => {
    const client = generateClient();
    try {
      // Fetch staff list
      const staffdata = await client.graphql({
        query: listTheViewIDUsers,
        variables: {},
      });

      const staffList = staffdata.data.listTheViewIDUsers.items;
      console.log('staffList--------', staffList);
      return staffList;
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const staffList = await listStaff(); // Fetch the list of existing staff

   
      let barcode =
        formData.barcode || generateRandom10DigitNumber().toString();

      if (!barcode || barcode.length !== 10) {
        setBarcodeError('Barcode must be exactly 10 digits.');
        return;
      }
      const isMatch = staffList.some(
        (staff) => staff.id === id && staff.scanNumber === barcode
      );
      if(!isMatch){
        const isBarcodeExists = staffList.some(
          (staff) => staff.scanNumber === barcode,
        );
  
        if (isBarcodeExists) {
          setBarcodeError( 'Barcode already exists. Please try another.' );
          return;
        }
      }
      // Check if the barcode already exists
     

      // 1️⃣ **Create User in the Database**
      const clientInput = {
        name: formData.name,
        employeeId: formData.employeeId,
        isLogin: 'false',
        scanNumber:
          formData.barcode || generateRandom10DigitNumber().toString(),
      };
      const clientResponse = await client.graphql({
        query: mutation.updateTheViewIDUser,
        variables: { input: { id, ...clientInput } },
        authMode: 'userPool', // Use Cognito User Pools authentication

      });
      console.log('Client created:', clientResponse);
      const createdItem = clientResponse.data.updateTheViewIDUser;
      const clientId = createdItem.id; // Extract the generated client ID
      console.log('Generated client ID:', clientId);
      // 2️⃣ **Upload Profile Picture to S3**
      if (file) {
        console.log('file', file.name);

        try {
          const uploadedFilePath = await uploadToS3s(
            file,
            clientId, // Use client ID as folder name
            file.name, // ✅ Use `file.name` instead
          );

          console.log('Uploaded file path:', uploadedFilePath);
          // 3️⃣ **Update User Record with Uploaded Image Path**
          const updateInput = {
            id: clientId,
            attachment: uploadedFilePath, // Store image URL in DB
          };
          console.log('Updating client with:', updateInput);
          const updateResponse = await client.graphql({
            query: mutation.updateTheViewIDUser,
            variables: { input: updateInput },
            authMode: 'userPool', // Use Cognito User Pools authentication

          });

          if (file) {
            console.log('file', file.name);
    
            try {
              const uploadedFilePath = await uploadToS3s(
                file,
                clientId, // Use client ID as folder name
                file.name, // ✅ Use `file.name` instead
              );
    
              console.log('Uploaded file path:', uploadedFilePath);
              // 3️⃣ **Update User Record with Uploaded Image Path**
              const updateInput = {
                id: clientId,
                attachment: uploadedFilePath, // Store image URL in DB
              };
              console.log('Updating client with:', updateInput);
              const updateResponse = await client.graphql({
                query: mutation.updateTheViewIDUser,
                variables: { input: updateInput },
                authMode: 'userPool', // Use Cognito User Pools authentication

              });
              console.log('Client updated successfully:', updateResponse);
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          }
          console.log('Client updated successfully:', updateResponse);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      // ✅ Navigate or show success message
      navigation('/ViewID'); // Change based on your routing
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const uploadToS3s = async (file, id, fileName) => {
    try {
      const fullKey = `User/userprofile/${id}/selfie/${fileName}`;

      const result = await uploadData({
        key: fullKey,
        data: file,
        options: {
          accessLevel: 'guest', // Change as necessary (guest, private, protected)
        },
      });
      console.log('Uploaded file key:', fullKey); // Log the key for verification
      return fullKey; // Return the key to use it in the mutation
    } catch (error) {
      console.error('Error uploading to S3: ', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  const fileInputRef = useRef(null);

  // Handle file change
  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    // Perform file handling here, e.g., uploading, setting the file URL
    console.log(file);
  };

  // Trigger file input click when pencil icon is clicked
  const handlePencilClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="flex mt-10 w-full justify-center items-center">
        <div className="justify-center items-center flex">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black">Make ID</h3>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-[430px] justify-center items-center p-5">
             

                <div className="w-full">
                  <label className="mb-2.5 mt-2 block text-black">
                    Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Your Name"
                    className="w-full rounded border-[1.5px] py-3 px-5 text-black outline-none"
                  />
                </div>
                <div className="w-full">
                  <label className="mb-2.5 mt-3 block text-black">
                    Employee ID <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your Employee ID"
                    className="w-full rounded border-[1.5px] py-3 px-5 text-black outline-none"
                  />
                </div>
                <div className="w-full">
                  <label className="mb-2.5 mt-3 block text-black">
                    Barcode <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Barcode"
                    className="w-full rounded border-[1.5px] py-3 px-5 text-black outline-none"
                  />
                </div>

              
                {barcodeError && (
                  <Text style={{ color: 'red', marginTop: 5 }}>
                    {barcodeError}
                  </Text>
                )}

                <div className="w-full">
                  <label className="mb-2.5 mt-2 block text-black">
                    Profile Picture <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded border-[1.5px] py-3 px-5 text-black outline-none"
                  />
                </div>
                <button className="w-full mt-10 btn-grad pr-20">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditViewId;
