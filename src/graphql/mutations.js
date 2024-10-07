/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTheShifts = /* GraphQL */ `
  mutation CreateTheShifts(
    $input: CreateTheShiftsInput!
    $condition: ModelTheShiftsConditionInput
  ) {
    createTheShifts(input: $input, condition: $condition) {
      id
      Location
      duties
      staffId
      time
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTheShifts = /* GraphQL */ `
  mutation UpdateTheShifts(
    $input: UpdateTheShiftsInput!
    $condition: ModelTheShiftsConditionInput
  ) {
    updateTheShifts(input: $input, condition: $condition) {
      id
      Location
      duties
      staffId
      time
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTheShifts = /* GraphQL */ `
  mutation DeleteTheShifts(
    $input: DeleteTheShiftsInput!
    $condition: ModelTheShiftsConditionInput
  ) {
    deleteTheShifts(input: $input, condition: $condition) {
      id
      Location
      duties
      staffId
      time
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTheStaff = /* GraphQL */ `
  mutation CreateTheStaff(
    $input: CreateTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    createTheStaff(input: $input, condition: $condition) {
      id
      name
      phoneNumber
      email
      DOB
      photourl
      isBiomatritcs
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTheStaff = /* GraphQL */ `
  mutation UpdateTheStaff(
    $input: UpdateTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    updateTheStaff(input: $input, condition: $condition) {
      id
      name
      phoneNumber
      email
      DOB
      photourl
      isBiomatritcs
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTheStaff = /* GraphQL */ `
  mutation DeleteTheStaff(
    $input: DeleteTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    deleteTheStaff(input: $input, condition: $condition) {
      id
      name
      phoneNumber
      email
      DOB
      photourl
      isBiomatritcs
      createdAt
      updatedAt
      __typename
    }
  }
`;
