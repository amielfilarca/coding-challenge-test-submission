import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import transformAddress from "./core/models/address";
import { BASE_URL } from "./lib/constants";
import { Address as AddressType } from "./types";
import useForm from "./ui/hooks/useForm";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const { onChange, values, reset } = useForm({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });
  const { postCode, houseNumber, firstName, lastName, selectedAddress } =
    values;
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!postCode || !houseNumber) {
      setError("Postcode and house number fields mandatory!");
      return;
    }

    try {
      setError(undefined);
      setIsLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: {
        details: {
          city: string;
          houseNumber: string;
          lat: number;
          long: number;
          postcode: string;
          street: string;
        }[];
        status: string;
      } = await response.json();

      const nextAddresses = data.details.map((address) =>
        transformAddress({
          city: address.city,
          houseNumber: address.houseNumber,
          lat: address.lat.toString(),
          lon: address.long.toString(),
          postcode: address.postcode,
          street: address.street,
          firstName: "",
          lastName: "",
          id: `${address.lat}_${address.long}`,
        })
      );

      setAddresses(nextAddresses);
      setError(undefined);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while fetching data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(undefined);

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label="🏠 Find an address"
          loading={false}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              onChange,
              value: postCode,
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              onChange,
              value: houseNumber,
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                onChange,
                value: firstName,
              },
              {
                name: "lastName",
                placeholder: "Last name",
                onChange,
                value: lastName,
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button
          variant="secondary"
          loading={isLoading}
          onClick={() => {
            reset();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
