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
import { createTheViewIDUser } from "../graphql/mutations";
const client = generateClient();
export default function TheViewIDUserCreateForm(props) {
  const {
    clearOnSuccess = true,
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
    employeeId: "",
    profileStatus: "",
    attachment: "",
    isLogin: "",
    scanNumber: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [employeeId, setEmployeeId] = React.useState(initialValues.employeeId);
  const [profileStatus, setProfileStatus] = React.useState(
    initialValues.profileStatus
  );
  const [attachment, setAttachment] = React.useState(initialValues.attachment);
  const [isLogin, setIsLogin] = React.useState(initialValues.isLogin);
  const [scanNumber, setScanNumber] = React.useState(initialValues.scanNumber);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setEmployeeId(initialValues.employeeId);
    setProfileStatus(initialValues.profileStatus);
    setAttachment(initialValues.attachment);
    setIsLogin(initialValues.isLogin);
    setScanNumber(initialValues.scanNumber);
    setErrors({});
  };
  const validations = {
    name: [],
    employeeId: [],
    profileStatus: [],
    attachment: [],
    isLogin: [],
    scanNumber: [],
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
          name,
          employeeId,
          profileStatus,
          attachment,
          isLogin,
          scanNumber,
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
            query: createTheViewIDUser.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TheViewIDUserCreateForm")}
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
              employeeId,
              profileStatus,
              attachment,
              isLogin,
              scanNumber,
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
        label="Employee id"
        isRequired={false}
        isReadOnly={false}
        value={employeeId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              employeeId: value,
              profileStatus,
              attachment,
              isLogin,
              scanNumber,
            };
            const result = onChange(modelFields);
            value = result?.employeeId ?? value;
          }
          if (errors.employeeId?.hasError) {
            runValidationTasks("employeeId", value);
          }
          setEmployeeId(value);
        }}
        onBlur={() => runValidationTasks("employeeId", employeeId)}
        errorMessage={errors.employeeId?.errorMessage}
        hasError={errors.employeeId?.hasError}
        {...getOverrideProps(overrides, "employeeId")}
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
              employeeId,
              profileStatus: value,
              attachment,
              isLogin,
              scanNumber,
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
        label="Attachment"
        isRequired={false}
        isReadOnly={false}
        value={attachment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              employeeId,
              profileStatus,
              attachment: value,
              isLogin,
              scanNumber,
            };
            const result = onChange(modelFields);
            value = result?.attachment ?? value;
          }
          if (errors.attachment?.hasError) {
            runValidationTasks("attachment", value);
          }
          setAttachment(value);
        }}
        onBlur={() => runValidationTasks("attachment", attachment)}
        errorMessage={errors.attachment?.errorMessage}
        hasError={errors.attachment?.hasError}
        {...getOverrideProps(overrides, "attachment")}
      ></TextField>
      <TextField
        label="Is login"
        isRequired={false}
        isReadOnly={false}
        value={isLogin}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              employeeId,
              profileStatus,
              attachment,
              isLogin: value,
              scanNumber,
            };
            const result = onChange(modelFields);
            value = result?.isLogin ?? value;
          }
          if (errors.isLogin?.hasError) {
            runValidationTasks("isLogin", value);
          }
          setIsLogin(value);
        }}
        onBlur={() => runValidationTasks("isLogin", isLogin)}
        errorMessage={errors.isLogin?.errorMessage}
        hasError={errors.isLogin?.hasError}
        {...getOverrideProps(overrides, "isLogin")}
      ></TextField>
      <TextField
        label="Scan number"
        isRequired={false}
        isReadOnly={false}
        value={scanNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              employeeId,
              profileStatus,
              attachment,
              isLogin,
              scanNumber: value,
            };
            const result = onChange(modelFields);
            value = result?.scanNumber ?? value;
          }
          if (errors.scanNumber?.hasError) {
            runValidationTasks("scanNumber", value);
          }
          setScanNumber(value);
        }}
        onBlur={() => runValidationTasks("scanNumber", scanNumber)}
        errorMessage={errors.scanNumber?.errorMessage}
        hasError={errors.scanNumber?.hasError}
        {...getOverrideProps(overrides, "scanNumber")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
