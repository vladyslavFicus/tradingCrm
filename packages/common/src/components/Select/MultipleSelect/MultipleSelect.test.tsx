import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import MultipleSelect, { Props } from './MultipleSelect';

const options: Props<string>['options'] = [{
  label: 'Option 1',
  value: 'Value 1',
}, {
  label: 'Option 2',
  value: 'Value 2',
}, {
  label: 'Option 3',
  value: 'Value 3',
}];

it('Render MultipleSelect', () => {
  render(
    <MultipleSelect
      data-testid="select"
      options={options}
    />,
  );

  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
});

it('Render MultipleSelect with placeholder', () => {
  const placeholder = 'Just select awesome options';

  render(
    <MultipleSelect
      data-testid="select"
      placeholder={placeholder}
      options={options}
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(placeholder)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
});

it('Render MultipleSelect with error', () => {
  const placeholder = 'Just select awesome options';
  const error = 'Options is required to save';

  render(
    <MultipleSelect
      data-testid="select"
      placeholder={placeholder}
      options={options}
      error={error}
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(placeholder)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
  expect(screen.getByText(error)).toBeInTheDocument();
});

it('Render MultipleSelect with loading state', () => {
  render(
    <MultipleSelect
      loading
      data-testid="select"
      options={options}
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');

  fireEvent.click(screen.getByText('Loading...'));

  expect(screen.getByTestId('ShortLoader')).toBeInTheDocument();
});

it('Render MultipleSelect with disabled state', () => {
  render(
    <MultipleSelect
      disabled
      data-testid="select"
      options={options}
    />,
  );

  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeDisabled();
  expect(screen.getByTestId('select')).toHaveValue('');

  fireEvent.click(screen.getByText('Any'));

  // Check that menu not opened
  expect(screen.queryByTestId('multiple-select-menu')).not.toBeInTheDocument();
});

it('Render MultipleSelect with single value option', () => {
  const selectedOption = options[1];

  render(
    <MultipleSelect
      data-testid="select"
      options={options}
      value={[selectedOption.value]}
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue(selectedOption.value);
});

it('Render MultipleSelect with label', () => {
  const label = 'My beautiful options';

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue('');
});

it('Render MultipleSelect with label and single value option', () => {
  const label = 'My beautiful options';
  const selectedOption = options[1];

  render(
    <MultipleSelect
      label={label}
      value={[selectedOption.value]}
      options={options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOption.value);
});

it('Render MultipleSelect with label and multiple value options', () => {
  const label = 'My beautiful options';
  const selectedOption = [options[1], options[2]];

  render(
    <MultipleSelect
      label={label}
      value={selectedOption.map(option => option.value)}
      options={options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOption.map(option => option.value).join(', '));
});

it('Render MultipleSelect and open menu', () => {
  const label = 'My beautiful options';

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.queryByText('Search')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

it('Render MultipleSelect and select one option', () => {
  const label = 'My beautiful options';
  const optionToSelect = options[0];

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Select one option
  fireEvent.click(screen.getByText(optionToSelect.label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getAllByText(optionToSelect.label).length).toBe(2);
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Check that all the provided options are rendered
  options.forEach((option) => {
    const elements = screen.getAllByText(option.label);

    expect(elements[elements.length > 1 ? 1 : 0]).toBeInTheDocument();
  });

  // Check that selected (clicked) option is checked
  expect(screen.getByLabelText(new RegExp(optionToSelect.label))).toBeChecked();
});

it('Render MultipleSelect and select multiple options', () => {
  const label = 'My beautiful options';
  const optionsToSelect = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Choose several option
  optionsToSelect.forEach((option) => {
    fireEvent.click(screen.getByText(option.label));
  });

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Check that all the provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });

  // Check that selected (clicked) options are checked
  optionsToSelect.forEach((option) => {
    expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
  });
});

it('Render MultipleSelect and select multiple options then click on "All" button', () => {
  const label = 'My beautiful options';
  const optionsToSelect = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Choose several option
  optionsToSelect.forEach((option) => {
    fireEvent.click(screen.getByText(option.label));
  });

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Check that all the provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();

    // Check that selected (clicked) options are checked
    if (optionsToSelect.includes(option)) {
      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();

      // Check that other options aren't checked
    } else {
      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  // Check that all the provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();

    // Check that all options are checked
    expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
  });
});

it('Render MultipleSelect and select multiple options then click on "Clear" button', async () => {
  const label = 'My beautiful options';

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  options.forEach((option) => {
    // Check that all the provided options are rendered
    expect(screen.getByText(option.label)).toBeInTheDocument();

    // Check that all options are checked
    expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
  });

  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.queryByText('All')).not.toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  // Click on "Clear" button inside available options section
  fireEvent.click(within(screen.getByTestId('multiple-select-available-options')).getByText('Clear'));

  options.forEach((option) => {
    // Check that all the provided options are rendered
    expect(screen.getByText(option.label)).toBeInTheDocument();

    // Check that all options are unchecked
    expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
  });
});

it('Render MultipleSelect with value to show selected options on first open', async () => {
  const label = 'My beautiful options';
  const selectedOptions = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      value={selectedOptions.map(option => option.value)}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });
});

it('Render MultipleSelect with value and click on "All" button', () => {
  const label = 'My beautiful options';
  const selectedOptions = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      value={selectedOptions.map(option => option.value)}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked and the same in available options
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    }
  });
});

it('Render MultipleSelect with value and click on "All" and "Clear" button on Available options section', () => {
  const label = 'My beautiful options';
  const selectedOptions = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      value={selectedOptions.map(option => option.value)}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(screen.getByText('3 options selected')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked and the same in available options
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    }
  });

  expect(screen.queryByText('All')).not.toBeInTheDocument();
  expect(screen.getAllByText('Clear').length).toBe(2);

  // Click on "Clear" button inside available options section
  fireEvent.click(within(screen.getByTestId('multiple-select-available-options')).getByText('Clear'));

  expect(screen.getByText('2 options selected')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });
});

it('Render MultipleSelect with value and click on "All" and "Clear" button on Selected options section', () => {
  const label = 'My beautiful options';
  const selectedOptions = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      value={selectedOptions.map(option => option.value)}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked and the same in available options
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    }
  });

  expect(screen.queryByText('All')).not.toBeInTheDocument();
  expect(screen.getAllByText('Clear').length).toBe(2);

  // Click on "Clear" button inside selected options section
  fireEvent.click(within(screen.getByTestId('multiple-select-selected-options')).getByText('Clear'));

  expect(screen.queryByTestId('selected-options')).not.toBeInTheDocument();

  options.forEach((option) => {
    expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
      .toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
  });
});

it('Render MultipleSelect and select multiple options and hide/open select to show selected options', () => {
  const label = 'My beautiful options';
  const optionsToSelect = [options[0], options[2]];

  render(
    <MultipleSelect
      label={label}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  optionsToSelect.forEach((option) => {
    fireEvent.click(screen.getByText(option.label));
  });

  // Hide select menu
  fireEvent.click(screen.getByLabelText(label));

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Clear')).toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (optionsToSelect.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options'))
        .queryByText(option.label)).not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });
});

it('Render MultipleSelect with searchable input', () => {
  const label = 'My beautiful options';

  render(
    <MultipleSelect
      searchable
      label={label}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.queryByText('Search')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  expect(screen.getByTestId('multiple-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

it('Render MultipleSelect with searchable and filter options', () => {
  const label = 'My beautiful options';
  const search = '2';

  render(
    <MultipleSelect
      searchable
      label={label}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.queryByText('Search')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  expect(screen.getByTestId('multiple-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });

  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: search } });

  // Check that options are filtered
  options.forEach((option) => {
    if (option.label.includes(search)) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });
});

it('Render MultipleSelect with searchable and filter options with not found', () => {
  const label = 'My beautiful options';
  const search = 'No found option';

  render(
    <MultipleSelect
      searchable
      label={label}
      options={options}
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.queryByText('Search')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  expect(screen.getByTestId('multiple-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });

  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: search } });

  expect(screen.getByText(`Available options by query "${search}" not found...`)).toBeInTheDocument();

  // Check that options are filtered
  options.forEach((option) => {
    expect(screen.queryByText(option.label)).not.toBeInTheDocument();
  });
});

it('Render MultipleSelect with searchable, value and filter options', () => {
  const label = 'My beautiful options';
  const selectedOptions = [options[1], options[2]];
  const search = '2';

  render(
    <MultipleSelect
      searchable
      label={label}
      value={selectedOptions.map(option => option.value)}
      options={options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText('2 options selected')).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOptions.map(option => option.value).join(', '));

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (selectedOptions.includes(option)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: search } });

  expect(screen.getByTestId('multiple-select-selected-options')).toBeInTheDocument();
  expect(screen.queryByTestId('multiple-select-available-options')).not.toBeInTheDocument();

  options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (option.label.includes(search)) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });
});

it('Render MultipleSelect with searchable, value and filter options with several found options', () => {
  const _options: Props<string>['options'] = [
    ...options,
    {
      label: 'Option X-2',
      value: 'Value X-2',
    },
  ];
  const label = 'My beautiful options';
  const selectedOption = options[1];
  const search = '2';

  render(
    <MultipleSelect
      searchable
      label={label}
      value={[selectedOption.value]}
      options={_options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOption.value);

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (option === selectedOption) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: search } });

  expect(screen.getByTestId('multiple-select-selected-options')).toBeInTheDocument();
  expect(screen.getByTestId('multiple-select-available-options')).toBeInTheDocument();

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (option.label.includes(search)) {
      if (option === selectedOption) {
        expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
      } else {
        expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
      }
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });
});

// eslint-disable-next-line max-len
it('Render MultipleSelect with searchable, value and filter options with several found options -> click all -> click clear', () => {
  const _options: Props<string>['options'] = [
    ...options,
    {
      label: 'Option X-2',
      value: 'Value X-2',
    },
  ];
  const label = 'My beautiful options';
  const selectedOption = options[1];
  const search = '2';

  render(
    <MultipleSelect
      searchable
      label={label}
      value={[selectedOption.value]}
      options={_options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOption.value);

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (option === selectedOption) {
      expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-available-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
    } else {
      expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
        .toBeInTheDocument();
      expect(within(screen.getByTestId('multiple-select-selected-options')).queryByText(option.label))
        .not.toBeInTheDocument();

      expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
    }
  });

  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: search } });

  expect(screen.getByTestId('multiple-select-selected-options')).toBeInTheDocument();
  expect(screen.getByTestId('multiple-select-available-options')).toBeInTheDocument();

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it unchecked and located in available options block.
    if (option.label.includes(search)) {
      if (option === selectedOption) {
        expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
      } else {
        expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
      }
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(screen.getByText('2 options selected')).toBeInTheDocument();

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it's checked and located in available options block.
    if (option.label.includes(search)) {
      if (option === selectedOption) {
        expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
      } else {
        expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
      }
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });

  // Click on "Clear" button inside available options section
  fireEvent.click(within(screen.getByTestId('multiple-select-available-options')).getByText('Clear'));

  expect(screen.queryByText('2 options selected')).not.toBeInTheDocument();
  expect(within(screen.getByTestId('multiple-select-control')).getByText(selectedOption.label))
    .toBeInTheDocument();

  _options.forEach((option) => {
    // Check that selected options in "selected options" section and really checked
    // And otherwise for unchecked options -> check that it's checked and located in available options block.
    if (option.label.includes(search)) {
      if (option === selectedOption) {
        expect(within(screen.getByTestId('multiple-select-selected-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).toBeChecked();
      } else {
        expect(within(screen.getByTestId('multiple-select-available-options')).getByText(option.label))
          .toBeInTheDocument();
        expect(screen.getByLabelText(new RegExp(option.label))).not.toBeChecked();
      }
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });
});

it('Render MultipleSelect and check onChange callback', () => {
  const label = 'My beautiful options';

  let selectedOptions: Array<string | undefined> = [];

  render(
    <MultipleSelect
      searchable
      label={label}
      options={options}
      onChange={(_selectedOptions) => { selectedOptions = _selectedOptions; }}
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Select one option
  fireEvent.click(screen.getByText(options[0].label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Available options')).toBeInTheDocument();
  expect(screen.queryByText('Selected options')).not.toBeInTheDocument();
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.queryByText('Clear')).not.toBeInTheDocument();

  // Check that selected (clicked) option is checked
  expect(screen.getByLabelText(new RegExp(options[0].label))).toBeChecked();

  expect(selectedOptions).toHaveLength(1);
  expect(selectedOptions).toEqual([options[0].value]);

  // ================= //

  // Select second option
  fireEvent.click(screen.getByText(options[1].label));

  expect(selectedOptions).toHaveLength(2);
  expect(selectedOptions).toEqual([options[0].value, options[1].value]);

  // ================= //

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(selectedOptions).toHaveLength(3);
  expect(selectedOptions).toEqual([options[0].value, options[1].value, options[2].value]);

  // ================= //

  // Click on "Clear" button
  fireEvent.click(screen.getByText('Clear'));

  expect(selectedOptions).toHaveLength(0);
  expect(selectedOptions).toEqual([]);

  // ================= //

  // Filter options with symbol "2"
  fireEvent.input(screen.getByTestId('multiple-select-menu-search-input'), { target: { value: '2' } });

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(selectedOptions).toHaveLength(1);
  expect(selectedOptions).toEqual([options[1].value]);

  // ================= //

  // Close select menu
  fireEvent.click(screen.getByLabelText(label));

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(selectedOptions).toHaveLength(3);
  expect(selectedOptions).toEqual([options[1].value, options[0].value, options[2].value]);

  // ================= //

  // Click on "Clear" button inside available options section
  fireEvent.click(within(screen.getByTestId('multiple-select-available-options')).getByText('Clear'));

  expect(selectedOptions).toHaveLength(1);
  expect(selectedOptions).toEqual([options[1].value]);

  // ================= //

  // Click on "All" button
  fireEvent.click(screen.getByText('All'));

  expect(selectedOptions).toHaveLength(3);
  expect(selectedOptions).toEqual([options[1].value, options[0].value, options[2].value]);

  // ================= //

  // Click on "Clear" button inside selected options section
  fireEvent.click(within(screen.getByTestId('multiple-select-selected-options')).getByText('Clear'));

  expect(selectedOptions).toHaveLength(0);
  expect(selectedOptions).toEqual([]);
});
