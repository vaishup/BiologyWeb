import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout';
import { Hotel, SquareUserRound } from 'lucide-react';
import {
  listTheShifts,

  listTheStaffs,
} from '../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';

const ECommerce: React.FC = () => {
  const [staffList, setStaffList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const navigation = useNavigate();

  // Fetch staff data
  const listStaff = async () => {
    const client = generateClient();
    try {
      const staffdata = await client.graphql({
        query: listTheStaffs,
        variables: {
        
        },
      });

      const staffList = staffdata.data.listTheStaffs.items;
      setStaffList(staffList);
      setStaffCount(staffList.length); // Set staff count
      console.log('Staff List:', staffList);
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  // Fetch shift data
  const listShifts = async () => {
    const client = generateClient();
    try {
      const shiftData = await client.graphql({
        query: listTheShifts, // Replace with your query for shifts
        variables: {},
      });

      const shiftsList = shiftData.data.listTheShifts.items;
      setShiftList(shiftsList);
      console.log("shiftsList",shiftsList);
      
      setShiftCount(shiftsList.length); // Set shift count
      console.log('Shift List:', shiftsList);
    } catch (error) {
      console.error('Error fetching shift details:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    listStaff();
    listShifts();
  }, []);

  return (
    <>
    

      <div className="mb-4">
        <p className="text-xl font-bold text-[#000000]">
          Welcome to Bio-logic{' '}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:gap-7.5">
        {/* Total Employee Card */}
        <div onClick={() =>{
          navigation('/clientlist')
        }}>
        <CardDataStats title="Total Employee" total={staffCount.toString()}>
          <SquareUserRound color="white" />
        </CardDataStats>
        </div>
       

        {/* Total Shifts Card */}
        <div className="ml-10" onClick={() =>{
          navigation('/taskList')
        }}>
          <CardDataStats title="Total Shifts" total={shiftCount.toString()}>
            <Hotel color="white" />
          </CardDataStats>
        </div>
      </div>
      </>
  );
};

export default ECommerce;
