import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

function BaseTextField({ id, label, required, defaultValue, onInput, ...props }) {
  return (
    <TextField
      autoFocus
      margin='dense'
      fullWidth
      variant='standard'
      id
      label
      required
      defaultValue
      onInput
      {...props}
    />
  );
}

BaseTextField.defaultProps = {
  id: '',
  label: '',
  required: false,
  defaultValue: '',
  onInput: () => {},
};

BaseTextField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  onInput: PropTypes.func,
};

export default BaseTextField;
