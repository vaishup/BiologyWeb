/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getMainShift } from "../graphql/queries";
import { updateMainShift } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function MainShiftUpdateForm(props) {
  const {
    id: idProp,
    mainShift: mainShiftModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    locationID: "",
    shiftName: "",
    duties: "",
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
    createdBy: "",
    startDate: "",
    endDate: "",
    shiftstatus: "",
    userId: "",
    staffIds: [],
  };
  const [locationID, setLocationID] = React.useState(initialValues.locationID);
  const [shiftName, setShiftName] = React.useState(initialValues.shiftName);
  const [duties, setDuties] = React.useState(initialValues.duties);
  const [shiftDate, setShiftDate] = React.useState(initialValues.shiftDate);
  const [shiftStartTime, setShiftStartTime] = React.useState(
    initialValues.shiftStartTime
  );
  const [shiftEndTime, setShiftEndTime] = React.useState(
    initialValues.shiftEndTime
  );
  const [createdBy, setCreatedBy] = React.useState(initialValues.createdBy);
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [endDate, setEndDate] = React.useState(initialValues.endDate);
  const [shiftstatus, setShiftstatus] = React.useState(
    initialValues.shiftstatus
  );
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [staffIds, setStaffIds] = React.useState(initialValues.staffIds);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = mainShiftRecord
      ? { ...initialValues, ...mainShiftRecord }
      : initialValues;
    setLocationID(cleanValues.locationID);
    setShiftName(cleanValues.shiftName);
    setDuties(cleanValues.duties);
    setShiftDate(cleanValues.shiftDate);
    setShiftStartTime(cleanValues.shiftStartTime);
    setShiftEndTime(cleanValues.shiftEndTime);
    setCreatedBy(cleanValues.createdBy);
    setStartDate(cleanValues.startDate);
    setEndDate(cleanValues.endDate);
    setShiftstatus(cleanValues.shiftstatus);
    setUserId(cleanValues.userId);
    setStaffIds(cleanValues.staffIds ?? []);
    setCurrentStaffIdsValue("");
    setErrors({});
  };
  const [mainShiftRecord, setMainShiftRecord] =
    React.useState(mainShiftModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getMainShift.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getMainShift
        : mainShiftModelProp;
      setMainShiftRecord(record);
    };
    queryData();
  }, [idProp, mainShiftModelProp]);
  React.useEffect(resetStateValues, [mainShiftRecord]);
  const [currentStaffIdsValue, setCurrentStaffIdsValue] = React.useState("");
  const staffIdsRef = React.createRef();
  const validations = {
    locationID: [],
    shiftName: [],
    duties: [],
    shiftDate: [],
    shiftStartTime: [],
    shiftEndTime: [],
    createdBy: [],
    startDate: [],
    endDate: [],
    shiftstatus: [],
    userId: [],
    staffIds: [],
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
          locationID: locationID ?? null,
          shiftName: shiftName ?? null,
          duties: duties ?? null,
          shiftDate: shiftDate ?? null,
          shiftStartTime: shiftStartTime ?? null,
          shiftEndTime: shiftEndTime ?? null,
          createdBy: createdBy ?? null,
          startDate: startDate ?? null,
          endDate: endDate ?? null,
          shiftstatus: shiftstatus ?? null,
          userId: userId ?? null,
          staffIds: staffIds ?? null,
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
            query: updateMainShift.replaceAll("__typename", ""),
            variables: {
              input: {
                id: mainShiftRecord.id,
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
      {...getOverrideProps(overrides, "MainShiftUpdateForm")}
      {...rest}
    >
      <TextField
        label="Location id"
        isRequired={false}
        isReadOnly={false}
        value={locationID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              locationID: value,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
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
        label="Shift name"
        isRequired={false}
        isReadOnly={false}
        value={shiftName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName: value,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
            };
            const result = onChange(modelFields);
            value = result?.shiftName ?? value;
          }
          if (errors.shiftName?.hasError) {
            runValidationTasks("shiftName", value);
          }
          setShiftName(value);
        }}
        onBlur={() => runValidationTasks("shiftName", shiftName)}
        errorMessage={errors.shiftName?.errorMessage}
        hasError={errors.shiftName?.hasError}
        {...getOverrideProps(overrides, "shiftName")}
      ></TextField>
      <TextField
        label="Duties"
        isRequired={false}
        isReadOnly={false}
        value={duties}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties: value,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
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
        label="Shift date"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={shiftDate && convertToLocal(new Date(shiftDate))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties,
              shiftDate: value,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
            };
            const result = onChange(modelFields);
            value = result?.shiftDate ?? value;
          }
          if (errors.shiftDate?.hasError) {
            runValidationTasks("shiftDate", value);
          }
          setShiftDate(value);
        }}
        onBlur={() => runValidationTasks("shiftDate", shiftDate)}
        errorMessage={errors.shiftDate?.errorMessage}
        hasError={errors.shiftDate?.hasError}
        {...getOverrideProps(overrides, "shiftDate")}
      ></TextField>
      <TextField
        label="Shift start time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={shiftStartTime && convertToLocal(new Date(shiftStartTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime: value,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
            };
            const result = onChange(modelFields);
            value = result?.shiftStartTime ?? value;
          }
          if (errors.shiftStartTime?.hasError) {
            runValidationTasks("shiftStartTime", value);
          }
          setShiftStartTime(value);
        }}
        onBlur={() => runValidationTasks("shiftStartTime", shiftStartTime)}
        errorMessage={errors.shiftStartTime?.errorMessage}
        hasError={errors.shiftStartTime?.hasError}
        {...getOverrideProps(overrides, "shiftStartTime")}
      ></TextField>
      <TextField
        label="Shift end time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={shiftEndTime && convertToLocal(new Date(shiftEndTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime: value,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
            };
            const result = onChange(modelFields);
            value = result?.shiftEndTime ?? value;
          }
          if (errors.shiftEndTime?.hasError) {
            runValidationTasks("shiftEndTime", value);
          }
          setShiftEndTime(value);
        }}
        onBlur={() => runValidationTasks("shiftEndTime", shiftEndTime)}
        errorMessage={errors.shiftEndTime?.errorMessage}
        hasError={errors.shiftEndTime?.hasError}
        {...getOverrideProps(overrides, "shiftEndTime")}
      ></TextField>
      <TextField
        label="Created by"
        isRequired={false}
        isReadOnly={false}
        value={createdBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy: value,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds,
            };
            const result = onChange(modelFields);
            value = result?.createdBy ?? value;
          }
          if (errors.createdBy?.hasError) {
            runValidationTasks("createdBy", value);
          }
          setCreatedBy(value);
        }}
        onBlur={() => runValidationTasks("createdBy", createdBy)}
        errorMessage={errors.createdBy?.errorMessage}
        hasError={errors.createdBy?.hasError}
        {...getOverrideProps(overrides, "createdBy")}
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
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate: value,
              endDate,
              shiftstatus,
              userId,
              staffIds,
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
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate: value,
              shiftstatus,
              userId,
              staffIds,
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
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus: value,
              userId,
              staffIds,
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
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId: value,
              staffIds,
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              locationID,
              shiftName,
              duties,
              shiftDate,
              shiftStartTime,
              shiftEndTime,
              createdBy,
              startDate,
              endDate,
              shiftstatus,
              userId,
              staffIds: values,
            };
            const result = onChange(modelFields);
            values = result?.staffIds ?? values;
          }
          setStaffIds(values);
          setCurrentStaffIdsValue("");
        }}
        currentFieldValue={currentStaffIdsValue}
        label={"Staff ids"}
        items={staffIds}
        hasError={errors?.staffIds?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("staffIds", currentStaffIdsValue)
        }
        errorMessage={errors?.staffIds?.errorMessage}
        setFieldValue={setCurrentStaffIdsValue}
        inputFieldRef={staffIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Staff ids"
          isRequired={false}
          isReadOnly={false}
          value={currentStaffIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.staffIds?.hasError) {
              runValidationTasks("staffIds", value);
            }
            setCurrentStaffIdsValue(value);
          }}
          onBlur={() => runValidationTasks("staffIds", currentStaffIdsValue)}
          errorMessage={errors.staffIds?.errorMessage}
          hasError={errors.staffIds?.hasError}
          ref={staffIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "staffIds")}
        ></TextField>
      </ArrayField>
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
          isDisabled={!(idProp || mainShiftModelProp)}
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
              !(idProp || mainShiftModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
