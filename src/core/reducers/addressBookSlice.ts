import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      /** TODO: Prevent duplicate addresses */
      if (
        state.addresses.findIndex(
          (address) => address.id === action.payload.id
        ) !== -1
      ) {
        return;
      }

      state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      /** TODO: Write a state update which removes an address from the addresses array. */
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload
      );

      if (index !== -1) {
        state.addresses.splice(index, 1);
      }
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
