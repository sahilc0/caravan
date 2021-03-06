export const UPDATE_DEPOSIT_NODE = "UPDATE_DEPOSIT_NODE";
export const UPDATE_CHANGE_NODE = "UPDATE_CHANGE_NODE";

export function updateDepositNodeAction(value) {
  return {
    type: UPDATE_DEPOSIT_NODE,
    value: {
      ...value,
      ...{change: false}
    },
  };
}

export function updateChangeNodeAction(value) {
  return {
    type: UPDATE_CHANGE_NODE,
    value: {
      ...value,
      ...{change: true}
    },
  };
}
