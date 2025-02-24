import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerMainShift = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MainShift, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly locationID?: string | null;
  readonly shiftName?: string | null;
  readonly duties?: string | null;
  readonly shiftDate?: string | null;
  readonly shiftStartTime?: string | null;
  readonly shiftEndTime?: string | null;
  readonly createdBy?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly shiftstatus?: string | null;
  readonly userId?: string | null;
  readonly staffIds?: (string | null)[] | null;
  readonly shifts?: (TheShifts | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMainShift = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MainShift, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly locationID?: string | null;
  readonly shiftName?: string | null;
  readonly duties?: string | null;
  readonly shiftDate?: string | null;
  readonly shiftStartTime?: string | null;
  readonly shiftEndTime?: string | null;
  readonly createdBy?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly shiftstatus?: string | null;
  readonly userId?: string | null;
  readonly staffIds?: (string | null)[] | null;
  readonly shifts: AsyncCollection<TheShifts>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MainShift = LazyLoading extends LazyLoadingDisabled ? EagerMainShift : LazyMainShift

export declare const MainShift: (new (init: ModelInit<MainShift>) => MainShift) & {
  copyOf(source: MainShift, mutator: (draft: MutableModel<MainShift>) => MutableModel<MainShift> | void): MainShift;
}

type EagerTheShifts = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheShifts, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly duties?: string | null;
  readonly staffId?: string | null;
  readonly time?: string | null;
  readonly startTime?: string | null;
  readonly endTime?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly shiftstatus?: string | null;
  readonly userId?: string | null;
  readonly checkInTIme?: string | null;
  readonly checkOutTime?: string | null;
  readonly AdminTime?: string | null;
  readonly AssignStatus?: string | null;
  readonly locationID?: string | null;
  readonly amendment?: string | null;
  readonly mainShiftID?: string | null;
  readonly mainShift?: MainShift | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTheShifts = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheShifts, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly duties?: string | null;
  readonly staffId?: string | null;
  readonly time?: string | null;
  readonly startTime?: string | null;
  readonly endTime?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly shiftstatus?: string | null;
  readonly userId?: string | null;
  readonly checkInTIme?: string | null;
  readonly checkOutTime?: string | null;
  readonly AdminTime?: string | null;
  readonly AssignStatus?: string | null;
  readonly locationID?: string | null;
  readonly amendment?: string | null;
  readonly mainShiftID?: string | null;
  readonly mainShift: AsyncItem<MainShift | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TheShifts = LazyLoading extends LazyLoadingDisabled ? EagerTheShifts : LazyTheShifts

export declare const TheShifts: (new (init: ModelInit<TheShifts>) => TheShifts) & {
  copyOf(source: TheShifts, mutator: (draft: MutableModel<TheShifts>) => MutableModel<TheShifts> | void): TheShifts;
}

type EagerLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Location = LazyLoading extends LazyLoadingDisabled ? EagerLocation : LazyLocation

export declare const Location: (new (init: ModelInit<Location>) => Location) & {
  copyOf(source: Location, mutator: (draft: MutableModel<Location>) => MutableModel<Location> | void): Location;
}

type EagerTheStaff = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheStaff, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly DOB?: string | null;
  readonly photourl?: string | null;
  readonly isBiomatritcs?: string | null;
  readonly profileStatus?: string | null;
  readonly Location?: string | null;
  readonly IsActive?: string | null;
  readonly latitude?: string | null;
  readonly longitude?: string | null;
  readonly shiftIds?: (string | null)[] | null;
  readonly userId?: string | null;
  readonly employeeId?: string | null;
  readonly staffStatus?: string | null;
  readonly scanNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTheStaff = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheStaff, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly DOB?: string | null;
  readonly photourl?: string | null;
  readonly isBiomatritcs?: string | null;
  readonly profileStatus?: string | null;
  readonly Location?: string | null;
  readonly IsActive?: string | null;
  readonly latitude?: string | null;
  readonly longitude?: string | null;
  readonly shiftIds?: (string | null)[] | null;
  readonly userId?: string | null;
  readonly employeeId?: string | null;
  readonly staffStatus?: string | null;
  readonly scanNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TheStaff = LazyLoading extends LazyLoadingDisabled ? EagerTheStaff : LazyTheStaff

export declare const TheStaff: (new (init: ModelInit<TheStaff>) => TheStaff) & {
  copyOf(source: TheStaff, mutator: (draft: MutableModel<TheStaff>) => MutableModel<TheStaff> | void): TheStaff;
}

type EagerTheAdminStaffUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheAdminStaffUser, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly userType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTheAdminStaffUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheAdminStaffUser, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly userType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TheAdminStaffUser = LazyLoading extends LazyLoadingDisabled ? EagerTheAdminStaffUser : LazyTheAdminStaffUser

export declare const TheAdminStaffUser: (new (init: ModelInit<TheAdminStaffUser>) => TheAdminStaffUser) & {
  copyOf(source: TheAdminStaffUser, mutator: (draft: MutableModel<TheAdminStaffUser>) => MutableModel<TheAdminStaffUser> | void): TheAdminStaffUser;
}

type EagerTheViewIDUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheViewIDUser, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly employeeId?: string | null;
  readonly profileStatus?: string | null;
  readonly attachment?: string | null;
  readonly isLogin?: string | null;
  readonly scanNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTheViewIDUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TheViewIDUser, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly employeeId?: string | null;
  readonly profileStatus?: string | null;
  readonly attachment?: string | null;
  readonly isLogin?: string | null;
  readonly scanNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TheViewIDUser = LazyLoading extends LazyLoadingDisabled ? EagerTheViewIDUser : LazyTheViewIDUser

export declare const TheViewIDUser: (new (init: ModelInit<TheViewIDUser>) => TheViewIDUser) & {
  copyOf(source: TheViewIDUser, mutator: (draft: MutableModel<TheViewIDUser>) => MutableModel<TheViewIDUser> | void): TheViewIDUser;
}