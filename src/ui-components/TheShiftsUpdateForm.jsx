/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getTheShifts } from "../graphql/queries";
import { updateTheShifts } from "../graphql/mutations";
const client = generateClient();
export default function TheShiftsUpdateForm(props) {
  const {
    id: idProp,
    theShifts: theShiftsModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    duties: "",
    staffId: "",
    time: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    shiftstatus: "",
    userId: "",
    checkInTIme: "",
    checkOutTime: "",
    AdminTime: "",
    AssignStatus: "",
    locationID: "",
    amendment: "",
  };
  const [duties, setDuties] = React.useState(initialValues.duties);
  const [staffId, setStaffId] = React.useState(initialValues.staffId);
  const [time, setTime] = React.useState(initialValues.time);
  const [startTime, setStartTime] = React.useState(initialValues.startTime);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [endDate, setEndDate] = React.useState(initialValues.endDate);
  const [shiftstatus, setShiftstatus] = React.useState(
    initialValues.shiftstatus
  );
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [checkInTIme, setCheckInTIme] = React.useState(
    initialValues.checkInTIme
  );
  const [checkOutTime, setCheckOutTime] = React.useState(
    initialValues.checkOutTime
  );
  const [AdminTime, setAdminTime] = React.useState(initialValues.AdminTime);
  const [AssignStatus, setAssignStatus] = React.useState(
    initialValues.AssignStatus
  );
  const [locationID, setLocationID] = React.useState(initialValues.locationID);
  const [amendment, setAmendment] = React.useState(initialValues.amendment);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = theShiftsRecord
      ? { ...initialValues, ...theShiftsRecord }
      : initialValues;
    setDuties(cleanValues.duties);
    setStaffId(cleanValues.staffId);
    setTime(cleanValues.time);
    setStartTime(cleanValues.startTime);
    setEndTime(cleanValues.endTime);
    setStartDate(cleanValues.startDate);
    setEndDate(cleanValues.endDate);
    setShiftstatus(cleanValues.shiftstatus);
    setUserId(cleanValues.userId);
    setCheckInTIme(cleanValues.checkInTIme);
    setCheckOutTime(cleanValues.checkOutTime);
    setAdminTime(cleanValues.AdminTime);
    setAssignStatus(cleanValues.AssignStatus);
    setLocationID(cleanValues.locationID);
    setAmendment(cleanValues.amendment);
    setErrors({});
  };
  const [theShiftsRecord, setTheShiftsRecord] =
    React.useState(theShiftsModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getTheShifts.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getTheShifts
        : theShiftsModelProp;
      setTheShiftsRecord(record);
    };
    queryData();
  }, [idProp, theShiftsModelProp]);
  React.useEffect(resetStateValues, [theShiftsRecord]);
  const validations = {
    duties: [],
    staffId: [],
    time: [],
    startTime: [],
    endTime: [],
    startDate: [],
    endDate: [],
    shiftstatus: [],
    userId: [],
    checkInTIme: [],
    checkOutTime: [],
    AdminTime: [],
    AssignStatus: [],
    locationID: [],
    amendment: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          duties: duties ?? null,
          staffId: staffId ?? null,
          time: time ?? null,
          startTime: startTime ?? null,
          endTime: endTime ?? null,
          startDate: startDate ?? null,
          endDate: endDate ?? null,
          shiftstatus: shiftstatus ?? null,
          userId: userId ?? null,
          checkInTIme: checkInTIme ?? null,
          checkOutTime: checkOutTime ?? null,
          AdminTime: AdminTime ?? null,
          AssignStatus: AssignStatus ?? null,
          locationID: locationID ?? null,
          amendment: amendment ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateTheShifts.replaceAll("__typename", ""),
            variables: {
              input: {
                id: theShiftsRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TheShiftsUpdateForm")}
      {...rest}
    >
      <TextField
        label="Duties"
        isRequired={false}
        isReadOnly={false}
        value={duties}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties: value,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.duties ?? value;
          }
          if (errors.duties?.hasError) {
            runValidationTasks("duties", value);
          }
          setDuties(value);
        }}
        onBlur={() => runValidationTasks("duties", duties)}
        errorMessage={errors.duties?.errorMessage}
        hasError={errors.duties?.hasError}
        {...getOverrideProps(overrides, "duties")}
      ></TextField>
      <TextField
        label="Staff id"
        isRequired={false}
        isReadOnly={false}
        value={staffId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId: value,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.staffId ?? value;
          }
          if (errors.staffId?.hasError) {
            runValidationTasks("staffId", value);
          }
          setStaffId(value);
        }}
        onBlur={() => runValidationTasks("staffId", staffId)}
        errorMessage={errors.staffId?.errorMessage}
        hasError={errors.staffId?.hasError}
        {...getOverrideProps(overrides, "staffId")}
      ></TextField>
      <TextField
        label="Time"
        isRequired={false}
        isReadOnly={false}
        value={time}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time: value,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.time ?? value;
          }
          if (errors.time?.hasError) {
            runValidationTasks("time", value);
          }
          setTime(value);
        }}
        onBlur={() => runValidationTasks("time", time)}
        errorMessage={errors.time?.errorMessage}
        hasError={errors.time?.hasError}
        {...getOverrideProps(overrides, "time")}
      ></TextField>
      <TextField
        label="Start time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={startTime && convertToLocal(new Date(startTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime: value,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.startTime ?? value;
          }
          if (errors.startTime?.hasError) {
            runValidationTasks("startTime", value);
          }
          setStartTime(value);
        }}
        onBlur={() => runValidationTasks("startTime", startTime)}
        errorMessage={errors.startTime?.errorMessage}
        hasError={errors.startTime?.hasError}
        {...getOverrideProps(overrides, "startTime")}
      ></TextField>
      <TextField
        label="End time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={endTime && convertToLocal(new Date(endTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime: value,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.endTime ?? value;
          }
          if (errors.endTime?.hasError) {
            runValidationTasks("endTime", value);
          }
          setEndTime(value);
        }}
        onBlur={() => runValidationTasks("endTime", endTime)}
        errorMessage={errors.endTime?.errorMessage}
        hasError={errors.endTime?.hasError}
        {...getOverrideProps(overrides, "endTime")}
      ></TextField>
      <TextField
        label="Start date"
        isRequired={false}
        isReadOnly={false}
        value={startDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate: value,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.startDate ?? value;
          }
          if (errors.startDate?.hasError) {
            runValidationTasks("startDate", value);
          }
          setStartDate(value);
        }}
        onBlur={() => runValidationTasks("startDate", startDate)}
        errorMessage={errors.startDate?.errorMessage}
        hasError={errors.startDate?.hasError}
        {...getOverrideProps(overrides, "startDate")}
      ></TextField>
      <TextField
        label="End date"
        isRequired={false}
        isReadOnly={false}
        value={endDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate: value,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.endDate ?? value;
          }
          if (errors.endDate?.hasError) {
            runValidationTasks("endDate", value);
          }
          setEndDate(value);
        }}
        onBlur={() => runValidationTasks("endDate", endDate)}
        errorMessage={errors.endDate?.errorMessage}
        hasError={errors.endDate?.hasError}
        {...getOverrideProps(overrides, "endDate")}
      ></TextField>
      <TextField
        label="Shiftstatus"
        isRequired={false}
        isReadOnly={false}
        value={shiftstatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus: value,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.shiftstatus ?? value;
          }
          if (errors.shiftstatus?.hasError) {
            runValidationTasks("shiftstatus", value);
          }
          setShiftstatus(value);
        }}
        onBlur={() => runValidationTasks("shiftstatus", shiftstatus)}
        errorMessage={errors.shiftstatus?.errorMessage}
        hasError={errors.shiftstatus?.hasError}
        {...getOverrideProps(overrides, "shiftstatus")}
      ></TextField>
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId: value,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Check in t ime"
        isRequired={false}
        isReadOnly={false}
        value={checkInTIme}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme: value,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.checkInTIme ?? value;
          }
          if (errors.checkInTIme?.hasError) {
            runValidationTasks("checkInTIme", value);
          }
          setCheckInTIme(value);
        }}
        onBlur={() => runValidationTasks("checkInTIme", checkInTIme)}
        errorMessage={errors.checkInTIme?.errorMessage}
        hasError={errors.checkInTIme?.hasError}
        {...getOverrideProps(overrides, "checkInTIme")}
      ></TextField>
      <TextField
        label="Check out time"
        isRequired={false}
        isReadOnly={false}
        value={checkOutTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime: value,
              AdminTime,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.checkOutTime ?? value;
          }
          if (errors.checkOutTime?.hasError) {
            runValidationTasks("checkOutTime", value);
          }
          setCheckOutTime(value);
        }}
        onBlur={() => runValidationTasks("checkOutTime", checkOutTime)}
        errorMessage={errors.checkOutTime?.errorMessage}
        hasError={errors.checkOutTime?.hasError}
        {...getOverrideProps(overrides, "checkOutTime")}
      ></TextField>
      <TextField
        label="Admin time"
        isRequired={false}
        isReadOnly={false}
        value={AdminTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime: value,
              AssignStatus,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.AdminTime ?? value;
          }
          if (errors.AdminTime?.hasError) {
            runValidationTasks("AdminTime", value);
          }
          setAdminTime(value);
        }}
        onBlur={() => runValidationTasks("AdminTime", AdminTime)}
        errorMessage={errors.AdminTime?.errorMessage}
        hasError={errors.AdminTime?.hasError}
        {...getOverrideProps(overrides, "AdminTime")}
      ></TextField>
      <TextField
        label="Assign status"
        isRequired={false}
        isReadOnly={false}
        value={AssignStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus: value,
              locationID,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.AssignStatus ?? value;
          }
          if (errors.AssignStatus?.hasError) {
            runValidationTasks("AssignStatus", value);
          }
          setAssignStatus(value);
        }}
        onBlur={() => runValidationTasks("AssignStatus", AssignStatus)}
        errorMessage={errors.AssignStatus?.errorMessage}
        hasError={errors.AssignStatus?.hasError}
        {...getOverrideProps(overrides, "AssignStatus")}
      ></TextField>
      <TextField
        label="Location id"
        isRequired={false}
        isReadOnly={false}
        value={locationID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID: value,
              amendment,
            };
            const result = onChange(modelFields);
            value = result?.locationID ?? value;
          }
          if (errors.locationID?.hasError) {
            runValidationTasks("locationID", value);
          }
          setLocationID(value);
        }}
        onBlur={() => runValidationTasks("locationID", locationID)}
        errorMessage={errors.locationID?.errorMessage}
        hasError={errors.locationID?.hasError}
        {...getOverrideProps(overrides, "locationID")}
      ></TextField>
      <TextField
        label="Amendment"
        isRequired={false}
        isReadOnly={false}
        value={amendment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              duties,
              staffId,
              time,
              startTime,
              endTime,
              startDate,
              endDate,
              shiftstatus,
              userId,
              checkInTIme,
              checkOutTime,
              AdminTime,
              AssignStatus,
              locationID,
              amendment: value,
            };
            const result = onChange(modelFields);
            value = result?.amendment ?? value;
          }
          if (errors.amendment?.hasError) {
            runValidationTasks("amendment", value);
          }
          setAmendment(value);
        }}
        onBlur={() => runValidationTasks("amendment", amendment)}
        errorMessage={errors.amendment?.errorMessage}
        hasError={errors.amendment?.hasError}
        {...getOverrideProps(overrides, "amendment")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || theShiftsModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || theShiftsModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
