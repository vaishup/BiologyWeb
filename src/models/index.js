// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { MainShift, TheShifts, Location, TheStaff, TheAdminStaffUser, TheViewIDUser } = initSchema(schema);

export {
  MainShift,
  TheShifts,
  Location,
  TheStaff,
  TheAdminStaffUser,
  TheViewIDUser
};