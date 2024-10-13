const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient(); // Assuming you're using DynamoDB for storage

// Function to fetch a shift by ID
async function fetchShiftById(shiftId) {
  const params = {
    TableName: "TheShifts-qfmdhqquffcdzhgu6efvoqwpru-staging", // Replace with your DynamoDB table name
    Key: {
      id: shiftId,
    },
  };

  try {
    const result = await docClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error("Error fetching shift:", error);
    throw new Error("Could not fetch shift details");
  }
}

// Function to create a new shift
async function createShift(shiftDetails, staffId) {
    console.log("shiftDetails",shiftDetails);
  const newShift = {
    ...shiftDetails,
    id: AWS.util.uuid.v4(), // Generate a new unique ID for the shift
    staffId: staffId, // Assign the new staff ID
  };
  console.log("newShift",newShift);

  const params = {
    TableName: "TheShifts-qfmdhqquffcdzhgu6efvoqwpru-staging", // Replace with your DynamoDB table name
    Item: newShift,
  };

  try {
    await docClient.put(params).promise();
    console.log("Shift created successfully for staffId:", staffId);
  } catch (error) {
    console.error("Error creating shift:", error);
    throw new Error("Could not create shift for staff");
  }
}

// Main function to replicate shift for each staff ID
async function replicateShiftForStaff(shiftId, selectedStaffIds) {
  try {
    // Fetch the shift details
    console.log("shiftId",shiftId);
    console.log("selectedStaffIds",selectedStaffIds);
    const shiftDetails = await fetchShiftById(shiftId);
    console.log("Fetched shift details:", shiftDetails);

    // Replicate the shift for each selected staff ID
    for (const staffId of selectedStaffIds) 
    {
      await createShift(shiftDetails, staffId);
    }

    console.log("Shifts replicated successfully for all staff IDs");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Shifts replicated successfully" }),
    };
  } catch (error) {
    console.error("Error replicating shifts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}

// Example usage
exports.handler = async (event) => {
    console.log("Raw event:", JSON.stringify(event, null, 2)); // Log the full event to debug

    // Check if payload is coming in a different structure (like inside event.body)
    let parsedEvent;
    try {
        parsedEvent = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    } catch (error) {
        console.error("Error parsing event body:", error);
    }

    const { id, selectedStaffIds } = parsedEvent || {}; // Extract id and selectedStaffIds
    console.log("Shift ID:", id);
    console.log("Selected staff IDs:", selectedStaffIds);

    if (!id || !selectedStaffIds) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Shift ID or selectedStaffIds missing" }),
        };
    }

    return await replicateShiftForStaff(id, selectedStaffIds);
};
