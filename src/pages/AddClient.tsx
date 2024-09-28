import { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { ArrowUpFromLine } from "lucide-react";

const AddClient = () => {
  const [name, setName] = useState();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return <ArrowUpFromLine className="text-2xl text-blue-500" />;
    } else {
      return <ArrowUpFromLine className="text-2xl text-gray-500" />;
    }
  };
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFile(filePreviews);
  };
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Add Staff" />

        <div className="flex mt-10  w-[full] justify-center items-center">
          <div className="justify-center items-center flex ">
            {/* <!-- Contact Form --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Staff's information
                </h3>
              </div>
              <form action="#" className="w-full"> {/* Increase form width to full width */}
  <div className="w-[430px] justify-center items-center p-5"> {/* Increase this container's width */}
    {/* Name Field */}
    <div className="w-full">
      <label className="mb-2.5 block text-black dark:text-white">
        Name <span className="text-meta-1">*</span>
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        type="email"
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
        type="text"
        placeholder="Enter your Phone Number"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    {/* Submit Button */}
    <button className="w-full mt-10 btn-grad pr-20">
      Submit
    </button>
  </div>
</form>

            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};
export default AddClient;
