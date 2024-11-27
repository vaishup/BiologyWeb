const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS({ region: 'us-east-2' }); // Replace 'your-region' with your AWS region
const sesTransport = require('nodemailer-ses-transport');

// Function to fetch a shift by ID
async function fetchShiftById(shiftId) {
  const params = {
    TableName: 'TheShifts-qfmdhqquffcdzhgu6efvoqwpru-staging',
    Key: { id: shiftId },
  };

  try {
    const result = await docClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error('Error fetching shift:', error);
    throw new Error('Could not fetch shift details');
  }
}

async function fetchStaffDetailsById(staffId) {
  const params = {
    TableName: 'TheStaff-qfmdhqquffcdzhgu6efvoqwpru-staging', // Replace with your actual staff table name
    Key: { id: staffId },
  };

  try {
    const result = await docClient.get(params).promise();
    return result.Item; // Returns the staff details including phoneNumber
  } catch (error) {
    console.error('Error fetching staff details:', error);
    throw new Error('Could not fetch staff details');
  }
}

// Function to send SMS
// Function to send SMS with shift details
const locationMap = {
  Airport: '2710 Britannia Rd E, Mississauga, ON L4W 1S9',
  Office: '2552 Finch Ave. West. Unit 105. Toronto M9M 2G3',
};

// Function to send SMS with formatted details
async function sendTextMessage(phoneNumber, shiftDetails) {
  console.log('shiftDetails...', shiftDetails);
  const { Location, startDate, startTime } = shiftDetails;
  console.log('startDate', startDate);
  console.log('startTime', startTime);
  // Format date and time
  const formattedDate = startDate.split('T')[0]; // Extract date part
  const formattedTime = startDate.split('T')[1].split('.')[0]; // Extract time part
  console.log('formattedTime', formattedTime);
  console.log('formattedDate', formattedDate);
  // Get full address for location
  const fullLocation = locationMap[Location] || Location; // Use map, fallback to original if not found

  const message = `Hello, You have been assigned a new shift by Royal Employment. Location: ${fullLocation}, Date: ${formattedDate}, Time: ${formattedTime}.`;

  const params = {
    Message: message, // The message to send
    PhoneNumber: phoneNumber, // Must include country code, e.g., +1234567890
  };

  console.log('Sending SMS with parameters:', params);

  try {
    const result = await sns.publish(params).promise();
    console.log('SMS sent successfully:', result);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Could not send SMS');
  }
}

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber.startsWith('+1')) {
    return `+1${phoneNumber}`;
  }
  return phoneNumber;
};
// Function to create a new shift
async function createShift(shiftDetails, staffId) {
  const newShift = {
    ...shiftDetails,
    id: AWS.util.uuid.v4(), // Generate a new unique ID
    staffId, // Assign the new staff ID
  };

  const params = {
    TableName: 'TheShifts-qfmdhqquffcdzhgu6efvoqwpru-staging',
    Item: newShift,
  };
  try {
    await docClient.put(params).promise();
    console.log('Shift created successfully for staffId:', staffId);
  } catch (error) {
    console.error('Error creating shift:', error);
    throw new Error('Could not create shift for staff');
  }
}

// Function to update an existing shift
async function updateShift(shiftId, staffId) {
  const params = {
    TableName: 'TheShifts-qfmdhqquffcdzhgu6efvoqwpru-staging',
    Key: { id: shiftId },
    UpdateExpression: 'SET staffId = :staffId',
    ExpressionAttributeValues: {
      ':staffId': staffId,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await docClient.update(params).promise();
    console.log('Shift updated successfully with staffId:', staffId);
  } catch (error) {
    console.error('Error updating shift:', error);
    throw new Error('Could not update shift');
  }
}

// Main function to replicate or update shifts
async function replicateShiftForStaff(shiftId, selectedStaffIds) {
  try {
    console.log('Shift ID:', shiftId);
    console.log('Selected Staff IDs:', selectedStaffIds);
    // Fetch the shift details
    const shiftDetails = await fetchShiftById(shiftId);
    if (selectedStaffIds.length === 1) {
      // Update the shift with the only staff ID
      await updateShift(shiftId, selectedStaffIds[0]);
    } else {
      // Update the original shift with the first staff ID
      await updateShift(shiftId, selectedStaffIds[0]);
      // Create new shifts for the remaining staff IDs
      for (let i = 1; i < selectedStaffIds.length; i++) {
        await createShift(shiftDetails, selectedStaffIds[i]);
      }
    }
    console.log('Shifts processed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shifts processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing shifts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}

// Lambda handler function
exports.handler = async (event) => {
  console.log('Raw event:', JSON.stringify(event, null, 2));
  let parsedEvent;
  try {
    parsedEvent =
      typeof event.body === 'string' ? JSON.parse(event.body) : event;
  } catch (error) {
    console.error('Error parsing event body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid event body' }),
    };
  }
  const { id, selectedStaffIds } = parsedEvent;
  console.log('', selectedStaffIds);
  const shiftDetails = await fetchShiftById(id);
  console.log('test drive-------------', shiftDetails);
  for (const staffId of selectedStaffIds) {
    const staffDetailsd = await fetchStaffDetailsById(staffId);
    console.log('shiftDetails', staffDetailsd);
    if (staffDetailsd && staffDetailsd.phoneNumber) {
      console.log('shiftDetails------', shiftDetails);

      const formattedPhoneNumber = formatPhoneNumber(staffDetailsd.phoneNumber);
      console.log('formattedPhoneNumber', formattedPhoneNumber);

      await sendTextMessage(formattedPhoneNumber, shiftDetails);
      console.log(`Message sent to phone number: ${staffDetailsd.phoneNumber}`);
    } else {
      console.warn(`Phone number not found for staff ID: ${staffId}`);
    }
  }
  //const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  //console.log('formattedPhoneNumber', formattedPhoneNumber);
  // await sendTextMessage(formattedPhoneNumber);

  if (
    !id ||
    !selectedStaffIds ||
    !Array.isArray(selectedStaffIds) ||
    selectedStaffIds.length === 0
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Shift ID or selectedStaffIds missing or invalid',
      }),
    };
  }

  return await replicateShiftForStaff(id, selectedStaffIds);
};
