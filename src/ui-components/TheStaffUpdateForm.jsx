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
import { getTheStaff } from "../graphql/queries";
import { updateTheStaff } from "../graphql/mutations";
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
export default function TheStaffUpdateForm(props) {
  const {
    id: idProp,
    theStaff: theStaffModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    phoneNumber: "",
    email: "",
    DOB: "",
    photourl: "",
    isBiomatritcs: "",
    profileStatus: "",
    Location: "",
    IsActive: "",
    shiftIds: [],
    userId: "",
    latitude: "",
    longitude: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [DOB, setDOB] = React.useState(initialValues.DOB);
  const [photourl, setPhotourl] = React.useState(initialValues.photourl);
  const [isBiomatritcs, setIsBiomatritcs] = React.useState(
    initialValues.isBiomatritcs
  );
  const [profileStatus, setProfileStatus] = React.useState(
    initialValues.profileStatus
  );
  const [Location, setLocation] = React.useState(initialValues.Location);
  const [IsActive, setIsActive] = React.useState(initialValues.IsActive);
  const [shiftIds, setShiftIds] = React.useState(initialValues.shiftIds);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [latitude, setLatitude] = React.useState(initialValues.latitude);
  const [longitude, setLongitude] = React.useState(initialValues.longitude);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = theStaffRecord
      ? { ...initialValues, ...theStaffRecord }
      : initialValues;
    setName(cleanValues.name);
    setPhoneNumber(cleanValues.phoneNumber);
    setEmail(cleanValues.email);
    setDOB(cleanValues.DOB);
    setPhotourl(cleanValues.photourl);
    setIsBiomatritcs(cleanValues.isBiomatritcs);
    setProfileStatus(cleanValues.profileStatus);
    setLocation(cleanValues.Location);
    setIsActive(cleanValues.IsActive);
    setShiftIds(cleanValues.shiftIds ?? []);
    setCurrentShiftIdsValue("");
    setUserId(cleanValues.userId);
    setLatitude(cleanValues.latitude);
    setLongitude(cleanValues.longitude);
    setErrors({});
  };
  const [theStaffRecord, setTheStaffRecord] = React.useState(theStaffModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getTheStaff.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getTheStaff
        : theStaffModelProp;
      setTheStaffRecord(record);
    };
    queryData();
  }, [idProp, theStaffModelProp]);
  React.useEffect(resetStateValues, [theStaffRecord]);
  const [currentShiftIdsValue, setCurrentShiftIdsValue] = React.useState("");
  const shiftIdsRef = React.createRef();
  const validations = {
    name: [],
    phoneNumber: [],
    email: [],
    DOB: [],
    photourl: [],
    isBiomatritcs: [],
    profileStatus: [],
    Location: [],
    IsActive: [],
    shiftIds: [],
    userId: [],
    latitude: [],
    longitude: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name: name ?? null,
          phoneNumber: phoneNumber ?? null,
          email: email ?? null,
          DOB: DOB ?? null,
          photourl: photourl ?? null,
          isBiomatritcs: isBiomatritcs ?? null,
          profileStatus: profileStatus ?? null,
          Location: Location ?? null,
          IsActive: IsActive ?? null,
          shiftIds: shiftIds ?? null,
          userId: userId ?? null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
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
            query: updateTheStaff.replaceAll("__typename", ""),
            variables: {
              input: {
                id: theStaffRecord.id,
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
      {...getOverrideProps(overrides, "TheStaffUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber: value,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber ?? value;
          }
          if (errors.phoneNumber?.hasError) {
            runValidationTasks("phoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber", phoneNumber)}
        errorMessage={errors.phoneNumber?.errorMessage}
        hasError={errors.phoneNumber?.hasError}
        {...getOverrideProps(overrides, "phoneNumber")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email: value,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Dob"
        isRequired={false}
        isReadOnly={false}
        value={DOB}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB: value,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.DOB ?? value;
          }
          if (errors.DOB?.hasError) {
            runValidationTasks("DOB", value);
          }
          setDOB(value);
        }}
        onBlur={() => runValidationTasks("DOB", DOB)}
        errorMessage={errors.DOB?.errorMessage}
        hasError={errors.DOB?.hasError}
        {...getOverrideProps(overrides, "DOB")}
      ></TextField>
      <TextField
        label="Photourl"
        isRequired={false}
        isReadOnly={false}
        value={photourl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl: value,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.photourl ?? value;
          }
          if (errors.photourl?.hasError) {
            runValidationTasks("photourl", value);
          }
          setPhotourl(value);
        }}
        onBlur={() => runValidationTasks("photourl", photourl)}
        errorMessage={errors.photourl?.errorMessage}
        hasError={errors.photourl?.hasError}
        {...getOverrideProps(overrides, "photourl")}
      ></TextField>
      <TextField
        label="Is biomatritcs"
        isRequired={false}
        isReadOnly={false}
        value={isBiomatritcs}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs: value,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.isBiomatritcs ?? value;
          }
          if (errors.isBiomatritcs?.hasError) {
            runValidationTasks("isBiomatritcs", value);
          }
          setIsBiomatritcs(value);
        }}
        onBlur={() => runValidationTasks("isBiomatritcs", isBiomatritcs)}
        errorMessage={errors.isBiomatritcs?.errorMessage}
        hasError={errors.isBiomatritcs?.hasError}
        {...getOverrideProps(overrides, "isBiomatritcs")}
      ></TextField>
      <TextField
        label="Profile status"
        isRequired={false}
        isReadOnly={false}
        value={profileStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus: value,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.profileStatus ?? value;
          }
          if (errors.profileStatus?.hasError) {
            runValidationTasks("profileStatus", value);
          }
          setProfileStatus(value);
        }}
        onBlur={() => runValidationTasks("profileStatus", profileStatus)}
        errorMessage={errors.profileStatus?.errorMessage}
        hasError={errors.profileStatus?.hasError}
        {...getOverrideProps(overrides, "profileStatus")}
      ></TextField>
      <TextField
        label="Location"
        isRequired={false}
        isReadOnly={false}
        value={Location}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location: value,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.Location ?? value;
          }
          if (errors.Location?.hasError) {
            runValidationTasks("Location", value);
          }
          setLocation(value);
        }}
        onBlur={() => runValidationTasks("Location", Location)}
        errorMessage={errors.Location?.errorMessage}
        hasError={errors.Location?.hasError}
        {...getOverrideProps(overrides, "Location")}
      ></TextField>
      <TextField
        label="Is active"
        isRequired={false}
        isReadOnly={false}
        value={IsActive}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive: value,
              shiftIds,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.IsActive ?? value;
          }
          if (errors.IsActive?.hasError) {
            runValidationTasks("IsActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("IsActive", IsActive)}
        errorMessage={errors.IsActive?.errorMessage}
        hasError={errors.IsActive?.hasError}
        {...getOverrideProps(overrides, "IsActive")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds: values,
              userId,
              latitude,
              longitude,
            };
            const result = onChange(modelFields);
            values = result?.shiftIds ?? values;
          }
          setShiftIds(values);
          setCurrentShiftIdsValue("");
        }}
        currentFieldValue={currentShiftIdsValue}
        label={"Shift ids"}
        items={shiftIds}
        hasError={errors?.shiftIds?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("shiftIds", currentShiftIdsValue)
        }
        errorMessage={errors?.shiftIds?.errorMessage}
        setFieldValue={setCurrentShiftIdsValue}
        inputFieldRef={shiftIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Shift ids"
          isRequired={false}
          isReadOnly={false}
          value={currentShiftIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.shiftIds?.hasError) {
              runValidationTasks("shiftIds", value);
            }
            setCurrentShiftIdsValue(value);
          }}
          onBlur={() => runValidationTasks("shiftIds", currentShiftIdsValue)}
          errorMessage={errors.shiftIds?.errorMessage}
          hasError={errors.shiftIds?.hasError}
          ref={shiftIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "shiftIds")}
        ></TextField>
      </ArrayField>
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId: value,
              latitude,
              longitude,
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
        label="Latitude"
        isRequired={false}
        isReadOnly={false}
        value={latitude}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude: value,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.latitude ?? value;
          }
          if (errors.latitude?.hasError) {
            runValidationTasks("latitude", value);
          }
          setLatitude(value);
        }}
        onBlur={() => runValidationTasks("latitude", latitude)}
        errorMessage={errors.latitude?.errorMessage}
        hasError={errors.latitude?.hasError}
        {...getOverrideProps(overrides, "latitude")}
      ></TextField>
      <TextField
        label="Longitude"
        isRequired={false}
        isReadOnly={false}
        value={longitude}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              phoneNumber,
              email,
              DOB,
              photourl,
              isBiomatritcs,
              profileStatus,
              Location,
              IsActive,
              shiftIds,
              userId,
              latitude,
              longitude: value,
            };
            const result = onChange(modelFields);
            value = result?.longitude ?? value;
          }
          if (errors.longitude?.hasError) {
            runValidationTasks("longitude", value);
          }
          setLongitude(value);
        }}
        onBlur={() => runValidationTasks("longitude", longitude)}
        errorMessage={errors.longitude?.errorMessage}
        hasError={errors.longitude?.hasError}
        {...getOverrideProps(overrides, "longitude")}
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
          isDisabled={!(idProp || theStaffModelProp)}
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
              !(idProp || theStaffModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
