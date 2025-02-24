import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import * as mutation from '../graphql/mutations.js';

const MakeID = () => {
  const API = generateClient();

  const navigation = useNavigate();
  const { id } = useParams(); // Get the staff ID from the URL
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null); // State for file
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected File:", selectedFile);
    }
  };
  
  const generateRandom10DigitNumber = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.employeeId || !file) {
      setErrors({ form: 'All fields are required!' });
      return;
    }
    try {
      // 1️⃣ **Create User in the Database**
      const clientInput = {
        name: formData.name,
        employeeId: formData.employeeId,
        isLogin: 'false',
        scanNumber: generateRandom10DigitNumber().toString() 
      };
      const clientResponse = await API.graphql({
        query: mutation.createTheViewIDUser,
        variables: { input: clientInput },
      });
      console.log('Client created:', clientResponse);
      const createdItem = clientResponse.data.createTheViewIDUser;
      const clientId = createdItem.id; // Extract the generated client ID
      console.log('Generated client ID:', clientId);
      // 2️⃣ **Upload Profile Picture to S3**
      if (file) {
        console.log("file",file.name);
        
        try {
          const uploadedFilePath = await uploadToS3s(
            file,
            clientId, // Use client ID as folder name
            file.name // ✅ Use `file.name` instead
          );
          
          console.log('Uploaded file path:', uploadedFilePath);
          // 3️⃣ **Update User Record with Uploaded Image Path**
          const updateInput = {
            id: clientId,
            attachment: uploadedFilePath, // Store image URL in DB
          };
          console.log('Updating client with:', updateInput);
          const updateResponse = await API.graphql({
            query: mutation.updateTheViewIDUser,
            variables: { input: updateInput },
          });
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

export default MakeID;
